// create-enquiry
// Handles contact-page "send us your request" enquiries. Unlike
// create-booking, this does NOT write to bookings/trip_instances -
// there's no seat held, no fare charged, no trip_instance_id (the
// contact page only has a free-text route/date, not a real departure
// selection). Its only job is to alert dispatch immediately by SMS
// and email so a human can follow up on WhatsApp or email, mirroring
// create-booking's notification step.

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
    const dispatchWaLink = `wa.me/${phone.replace(/[^0-9]/g, "")}`;

    const smsBody = toGsm7Safe(
      `${enquiryRef} ENQUIRY: ${name}, ${route || "route TBC"}, ${date}, ${passengers || 1}pax. ${dispatchWaLink}`
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
    // Internal-only, same as create-booking's philosophy: client-facing
    // auto-confirmation is a later phase. The team replies to the
    // client by WhatsApp or email themselves once they see this.
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromAddress = Deno.env.get("NOTIFICATION_FROM_EMAIL") || "Intercoutra Shuttle Services <bookings@anchordrive.co.za>";
    if (resendKey) {
      const internalEmails = (recipients || []).filter((r) => r.email).map((r) => r.email);
      if (internalEmails.length > 0) {
        const emailResponse = await fetch("https://api.resend.com/emails", {
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
              <p><a href="https://${dispatchWaLink}">Message ${name} on WhatsApp →</a></p>
            `,
          }),
        });
        if (!emailResponse.ok) {
          console.error("Resend rejected the request:", emailResponse.status, await emailResponse.text());
        } else {
          console.log("Resend accepted the request:", await emailResponse.text());
        }
      }
    } else {
      console.log("Resend not attempted - missing RESEND_API_KEY.");
    }

    return new Response(JSON.stringify({ success: true, enquiry_ref: enquiryRef }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
