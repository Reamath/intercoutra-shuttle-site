// create-booking
// Handles the actual booking write server-side, using trusted access
// so the public website never needs broad read/write permission on
// the clients table. Also computes the fare server-side rather than
// trusting whatever the browser sends, so it can't be tampered with.
//
// Rate-limiting (added 2026-07-26): this is a public, unauthenticated
// POST endpoint that fires a real SMS + email per call, so it needs
// abuse protection. Two layers, both intentionally generous so a real
// family booking a return trip never gets blocked:
//   1. Honeypot - a hidden form field real users never fill in. Bots
//      that blindly fill every field trip it; we fake a normal success
//      response so they don't learn to avoid the field, but never
//      write anything or send any notification.
//   2. Per-phone and per-IP throttling - checks the booking_rate_limit
//      table for how many attempts (successful or not) came from this
//      phone/IP in the last window, and rejects with a friendly message
//      pointing to WhatsApp if the caller is over the limit.

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SMS specifically needs to stay in GSM-7 encoding (160 chars/segment).
// A single non-GSM-7 character (arrows, en-dashes, curly quotes, etc.)
// forces the WHOLE message into Unicode encoding, which drops capacity
// to 70 chars/segment. This strips the common offenders down to plain
// GSM-7-safe equivalents, but only for the SMS body - email and
// WhatsApp text are untouched since they don't have this constraint.
function toGsm7Safe(text) {
  return text
    .replace(/[→➜➔]/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[''']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/…/g, "...");
}

// Per-phone: 3 attempts per 15 minutes - enough for a genuine return
// booking plus a retry after a typo, not enough for spam.
const PHONE_LIMIT = 3;
const PHONE_WINDOW_MINUTES = 15;
// Per-IP: looser, catches a bot cycling through fake phone numbers
// from one machine.
const IP_LIMIT = 8;
const IP_WINDOW_MINUTES = 15;

function getClientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || "unknown";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      first_name, surname, phone, alt_phone, email,
      emergency_contact_name, emergency_contact_phone,
      trip_instance_id, return_trip_instance_id,
      passengers, large_bags, other_bag_note,
      passenger_names, // array of strings - names of additional travelers, not the lead booker
      website, // honeypot - real users never see or fill this field
    } = body;

    // Honeypot tripped - pretend everything worked. Returning an error
    // or a different shape teaches bots to detect and avoid the field;
    // a fake success is the standard countermeasure.
    if (website) {
      return new Response(
        JSON.stringify({ success: true, booking_ref: "IC-0000", return_booking_ref: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!first_name || !surname || !phone || !trip_instance_id) {
      return new Response(JSON.stringify({ success: false, error: "Missing required fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Trusted server-side client - bypasses RLS entirely, which is why
    // this code has to live here and not in the browser.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    // -- Rate limit check, before touching bookings/clients at all --
    const clientIp = getClientIp(req);
    const phoneWindowStart = new Date(Date.now() - PHONE_WINDOW_MINUTES * 60 * 1000).toISOString();
    const ipWindowStart = new Date(Date.now() - IP_WINDOW_MINUTES * 60 * 1000).toISOString();

    const { count: phoneCount, error: phoneCountErr } = await supabase
      .from("booking_rate_limit")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone)
      .gte("created_at", phoneWindowStart);
    if (phoneCountErr) throw phoneCountErr;

    const { count: ipCount, error: ipCountErr } = await supabase
      .from("booking_rate_limit")
      .select("id", { count: "exact", head: true })
      .eq("ip", clientIp)
      .gte("created_at", ipWindowStart);
    if (ipCountErr) throw ipCountErr;

    if ((phoneCount ?? 0) >= PHONE_LIMIT || (ipCount ?? 0) >= IP_LIMIT) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Too many booking attempts in a short time. Please wait a few minutes, or message us directly on WhatsApp.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log this attempt regardless of what happens next - counts
    // retries too, which is what actually matters for abuse.
    await supabase.from("booking_rate_limit").insert({ phone, ip: clientIp });

    // 1. Upsert the client by phone number
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .upsert({
        first_name, surname, phone,
        alt_phone: alt_phone || null,
        email: email || null,
        emergency_contact_name: emergency_contact_name || null,
        emergency_contact_phone: emergency_contact_phone || null,
      }, { onConflict: "phone" })
      .select()
      .single();

    if (clientErr) throw clientErr;

    const holdExpiry = new Date(Date.now() + 45 * 60 * 1000).toISOString();
    const returnGroupId = return_trip_instance_id ? crypto.randomUUID() : null;
    const genRef = () => "IC-" + Math.floor(1000 + Math.random() * 9000);

    // 2. Insert the outbound leg - fare is fixed server-side, not client-supplied
    const outboundRef = genRef();
    const { data: outboundBooking, error: outErr } = await supabase.from("bookings").insert({
      booking_ref: outboundRef,
      client_id: client.id,
      trip_instance_id,
      return_group_id: returnGroupId,
      passengers: passengers || 1,
      large_bags: large_bags || 0,
      other_bag_note: other_bag_note || null,
      fare_amount: 850,
      status: "pending_hold",
      hold_expires_at: holdExpiry,
      popia_booking_consent: true,
    }).select().single();
    if (outErr) throw outErr;

    // 2b. Log every traveler's name against this leg - not just the
    // lead booker - matters for accident/incident records.
    if (Array.isArray(passenger_names) && passenger_names.length > 0) {
      const rows = passenger_names
        .filter((n) => n && n.trim())
        .map((n) => ({ booking_id: outboundBooking.id, full_name: n.trim() }));
      if (rows.length > 0) {
        const { error: paxErr } = await supabase.from("booking_passengers").insert(rows);
        if (paxErr) throw paxErr;
      }
    }

    // 3. Insert the return leg too, if one was chosen
    let returnRef = null;
    if (return_trip_instance_id) {
      returnRef = genRef();
      const { data: returnBooking, error: retErr } = await supabase.from("bookings").insert({
        booking_ref: returnRef,
        client_id: client.id,
        trip_instance_id: return_trip_instance_id,
        return_group_id: returnGroupId,
        passengers: passengers || 1,
        large_bags: large_bags || 0,
        other_bag_note: other_bag_note || null,
        fare_amount: 750,
        status: "pending_hold",
        hold_expires_at: holdExpiry,
        popia_booking_consent: true,
      }).select().single();
      if (retErr) throw retErr;

      // Same passenger list applies to the return leg - same people,
      // potentially a different driver/vehicle assigned to this leg.
      if (Array.isArray(passenger_names) && passenger_names.length > 0) {
        const rows = passenger_names
          .filter((n) => n && n.trim())
          .map((n) => ({ booking_id: returnBooking.id, full_name: n.trim() }));
        if (rows.length > 0) {
          const { error: paxErr2 } = await supabase.from("booking_passengers").insert(rows);
          if (paxErr2) throw paxErr2;
        }
      }
    }

    // 4. Notify - client email/SMS confirmation is a later phase once
    // WhatsApp/Meta is approved; for now, alert dispatch immediately
    // by SMS and email, and email the client a receipt if they gave
    // an address. Wrapped so a notification failure never blocks the
    // booking itself - the booking succeeding is what actually matters.
    try {
      const { data: trip } = await supabase
        .from("trip_instances")
        .select("origin_label, destination_label, departure_at")
        .eq("id", trip_instance_id)
        .single();

      const { data: recipients } = await supabase
        .from("notification_recipients")
        .select("phone, email")
        .eq("active", true);

      const departTime = trip
        ? new Date(trip.departure_at).toLocaleString("en-ZA", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
        : "—";
      const routeText = trip ? `${trip.origin_label} → ${trip.destination_label}` : "route unavailable";

      // WhatsApp click-to-chat link for the CLIENT-facing confirmation
      // message (used in the email/future WhatsApp flow, not the SMS).
      const waMessage = encodeURIComponent(
        `Hi ${first_name}, confirming your Intercoutra booking (${outboundRef}) for ${routeText} on ${departTime}. Here are your payment options...`
      );
      const waLink = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${waMessage}`;

      // Dispatch-facing SMS gets a bare click-to-chat link only.
      const dispatchWaLink = `wa.me/${phone.replace(/[^0-9]/g, "")}`;

      const shortDepart = trip
        ? new Date(trip.departure_at).toLocaleString("en-ZA", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false })
        : "TBC";

      const smsBody = toGsm7Safe(
        `${outboundRef}: ${first_name}, ${routeText}, ${shortDepart}, ${passengers || 1}pax. ${dispatchWaLink}`
      );

      // -- SMS via SMSPortal --
      const smsportalClientId = Deno.env.get("SMSPORTAL_CLIENT_ID");
      const smsportalSecret = Deno.env.get("SMSPORTAL_CLIENT_SECRET");
      if (smsportalClientId && smsportalSecret && recipients) {
        const smsRecipients = recipients.filter((r) => r.phone);
        if (smsRecipients.length > 0) {
          const authResponse = await fetch("https://rest.smsportal.com/Authentication", {
            method: "POST",
            headers: { "Authorization": "Basic " + btoa(`${smsportalClientId}:${smsportalSecret}`) },
          });
          if (!authResponse.ok) {
            console.error("SMSPortal auth failed:", authResponse.status, await authResponse.text());
          } else {
            const { token, schema } = await authResponse.json();
            // No senderId set - custom alphanumeric Sender IDs are
            // blocked on South African networks (same restriction that
            // applied under BulkSMS), so let SMSPortal use its default.
            const smsResponse = await fetch("https://rest.smsportal.com/v3/BulkMessages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `${schema} ${token}`,
              },
              body: JSON.stringify({
                messages: smsRecipients.map((r) => ({
                  destination: r.phone.startsWith("+") ? r.phone : `+${r.phone}`,
                  content: smsBody,
                })),
              }),
            });
            if (!smsResponse.ok) {
              const errorText = await smsResponse.text();
              console.error("SMSPortal rejected the request:", smsResponse.status, errorText);
            } else {
              console.log("SMSPortal accepted the request:", await smsResponse.text());
            }
          }
        }
      } else {
        console.log("SMSPortal not attempted - missing credentials or no active recipients.", {
          hasId: !!smsportalClientId, hasSecret: !!smsportalSecret, recipientCount: recipients?.length ?? 0,
        });
      }

      // -- Email via Resend --
      const resendKey = Deno.env.get("RESEND_API_KEY");
      const fromAddress = Deno.env.get("NOTIFICATION_FROM_EMAIL") || "Intercoutra Shuttle Services <bookings@anchordrive.co.za>";
      if (resendKey) {
        const internalEmails = (recipients || []).filter((r) => r.email).map((r) => r.email);
        const allTo = [...internalEmails];
        if (email) allTo.push(email);

        if (allTo.length > 0) {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${resendKey}`,
            },
            body: JSON.stringify({
              from: fromAddress,
              to: allTo,
              subject: `Booking ${outboundRef} - ${routeText}`,
              html: `
                <p>Booking reference: <strong>${outboundRef}</strong></p>
                <p>Traveler: ${first_name} ${surname}</p>
                <p>Route: ${routeText}</p>
                <p>Departure: ${departTime}</p>
                <p>Passengers: ${passengers || 1}</p>
                <p>Seat held for 45 minutes.</p>
                <p><a href="${waLink}">Message ${first_name} on WhatsApp with their confirmation →</a></p>
              `,
            }),
          });
          if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error("Resend rejected the request:", emailResponse.status, errorText);
          } else {
            console.log("Resend accepted the request:", await emailResponse.text());
          }
        }
      } else {
        console.log("Resend not attempted - missing RESEND_API_KEY.");
      }
    } catch (notifyErr) {
      // Deliberately swallowed - the booking already succeeded and
      // that's what matters. Logged so it's visible in Edge Function
      // logs without breaking the client's experience.
      console.error("Notification sending failed:", notifyErr);
    }

    return new Response(
      JSON.stringify({ success: true, booking_ref: outboundRef, return_booking_ref: returnRef }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
