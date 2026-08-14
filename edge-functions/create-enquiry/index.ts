// create-enquiry
// Handles contact-page "send us your request" enquiries. Unlike
// create-booking, this does NOT write to bookings/trip_instances -
// there's no seat held, no fare charged, no trip_instance_id (the
// contact page only has a free-text route/date, not a real departure
// selection). Its job is twofold:
//   1. Alert dispatch immediately by SMS and email so a human follows up.
//   2. Acknowledge the client themselves - a prefilled WhatsApp link for
//      dispatch to send with one click, plus a direct confirmation email
//      if the client gave one. Neither of these promises a booking or a
//      price - they just confirm the enquiry was received.

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Same GSM-7 constraint as create-booking - see that function for the
// full explanation. Only applied to the SMS body.
function toGsm7Safe(text) {
  return text
    .replace(/[→➜➔]/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[''']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/…/g, "...");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, phone, email, route, date, passengers, message } = body;

    if (!name || !phone || !date) {
      return new Response(JSON.stringify({ success: false, error: "Missing required fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const { data: recipients } = await supabase
      .from("notification_recipients")
      .select("phone, email")
      .eq("active", true);

    const enquiryRef = "ICE-" + Math.floor(1000 + Math.random() * 9000);
    const clientPhoneDigits = phone.replace(/[^0-9]/g, "");

    // Client-facing WhatsApp acknowledgment - a prefilled message dispatch
    // can send to the client with one click. Doesn't promise a price or a
    // confirmed booking, just that the enquiry was received.
    const clientWaMessage = toGsm7Safe(
      `Hi ${name}, thank you for your enquiry with Intercoutra Shuttle Services regarding ${route || "your trip"}. ` +
      `We've received your details (ref ${enquiryRef}) and one of our team will be in touch shortly to help arrange everything. ` +
      `Feel free to reply here if you have any questions in the meantime.`
    );
    const clientWaLink = `wa.me/${clientPhoneDigits}?text=${encodeURIComponent(clientWaMessage)}`;

    const smsBody = toGsm7Safe(
      `${enquiryRef} ENQUIRY: ${name}, ${route || "route TBC"}, ${date}, ${passengers || 1}pax. wa.me/${clientPhoneDigits}`
    );

    // -- SMS via SMSPortal (internal alert to dispatch) --
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
            console.error("SMSPortal rejected the request:", smsResponse.status, await smsResponse.text());
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
      // Internal alert to dispatch - includes the prefilled WhatsApp link
      // so a human can message the client back with one click.
      const internalEmails = (recipients || []).filter((r) => r.email).map((r) => r.email);
      if (internalEmails.length > 0) {
        const internalEmailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: internalEmails,
            subject: `Website enquiry ${enquiryRef} - ${route || "route TBC"}`,
            html: `
              <p>Enquiry reference: <strong>${enquiryRef}</strong></p>
              <p>Name: ${name}</p>
              <p>Phone: ${phone}</p>
              ${email ? `<p>Email: ${email}</p>` : ""}
              <p>Route: ${route || "not specified"}</p>
              <p>Date: ${date}</p>
              <p>Passengers: ${passengers || 1}</p>
              ${message ? `<p>Message: ${message}</p>` : ""}
              <p><a href="https://${clientWaLink}">Message ${name} on WhatsApp (prefilled) →</a></p>
            `,
          }),
        });
        if (!internalEmailResponse.ok) {
          console.error("Resend rejected the internal alert:", internalEmailResponse.status, await internalEmailResponse.text());
        } else {
          console.log("Resend accepted the internal alert:", await internalEmailResponse.text());
        }
      }

      // Client-facing acknowledgment - only sent if the client gave an
      // email. Confirms receipt only, no price or booking promise; a
      // human still follows up to actually arrange the trip.
      if (email) {
        const clientEmailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            subject: `We've received your enquiry - Intercoutra Shuttle Services (ref ${enquiryRef})`,
            html: `
              <p>Hi ${name},</p>
              <p>Thank you for your enquiry with Intercoutra Shuttle Services. We've received your request and one of our team will be in touch shortly by WhatsApp, phone or email to help arrange your trip.</p>
              <p><strong>Your enquiry details</strong></p>
              <ul>
                <li>Reference: ${enquiryRef}</li>
                <li>Service: ${route || "not specified"}</li>
                <li>Date: ${date}</li>
                <li>Passengers: ${passengers || 1}</li>
                ${message ? `<li>Message: ${message}</li>` : ""}
              </ul>
              <p>If you'd like to reach us directly in the meantime, you're welcome to reply to this email or message us on WhatsApp.</p>
              <p>Intercoutra Shuttle Services<br>Safe. Reliable. Comfortable.</p>
            `,
          }),
        });
        if (!clientEmailResponse.ok) {
          console.error("Resend rejected the client acknowledgment:", clientEmailResponse.status, await clientEmailResponse.text());
        } else {
          console.log("Resend accepted the client acknowledgment:", await clientEmailResponse.text());
        }
      }
    } else {
      console.log("Resend not attempted - missing RESEND_API_KEY.");
    }

    return new Response(JSON.stringify({ success: true, enquiry_ref: enquiryRef, client_whatsapp_link: `https://${clientWaLink}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
