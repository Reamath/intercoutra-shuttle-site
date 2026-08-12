import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SERVICE_LABELS: Record<string, string> = {
  airport: "Airport Transfer",
  eswatini: "Eswatini Shuttle",
  soweto: "JHB/Soweto Tour",
  "cape-town": "Cape Town Tour",
};
const VALID_SERVICES = new Set(Object.keys(SERVICE_LABELS));
const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_MAX_PER_PHONE = 3;
const RATE_LIMIT_MAX_PER_IP = 8;

interface EnquiryPayload {
  name?: string;
  phone?: string;
  email?: string | null;
  service?: string;
  travel_date?: string | null;
  passengers?: number;
  message?: string | null;
  source?: string;
  website?: string; // honeypot - real visitors never fill this in
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: EnquiryPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot, not a real visitor. Return
  // a fake success so the bot doesn't learn to adapt, but do nothing.
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const name = (body.name || "").trim().slice(0, 200);
  const phone = (body.phone || "").trim().slice(0, 40);
  const email = body.email ? body.email.trim().slice(0, 200) : null;
  const service = (body.service || "").trim();
  const travelDate = body.travel_date || null;
  const passengers = Number.isFinite(body.passengers) ? Math.max(1, Math.min(50, Number(body.passengers))) : 1;
  const message = body.message ? body.message.trim().slice(0, 2000) : null;
  const source = (body.source || "website").slice(0, 100);

  // Server-side validation - never trust the client alone.
  if (!name) return NextResponse.json({ success: false, error: "Please enter your full name." }, { status: 400 });
  if (!phone || !phone.startsWith("+")) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid phone number including country code." },
      { status: 400 }
    );
  }
  if (!VALID_SERVICES.has(service)) {
    return NextResponse.json({ success: false, error: "Please choose a valid service." }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  let supabase: ReturnType<typeof supabaseAdmin>;
  try {
    supabase = supabaseAdmin();
  } catch (err) {
    console.error("Supabase not configured:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong saving your enquiry. Please try WhatsApp instead." },
      { status: 500 }
    );
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

  try {
    const [{ count: phoneCount }, { count: ipCount }] = await Promise.all([
      supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("phone", phone)
        .gte("created_at", windowStart),
      supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("source_ip", ip)
        .gte("created_at", windowStart),
    ]);

    if ((phoneCount || 0) >= RATE_LIMIT_MAX_PER_PHONE || (ipCount || 0) >= RATE_LIMIT_MAX_PER_IP) {
      return NextResponse.json(
        { success: false, error: "Too many enquiries submitted recently. Please try WhatsApp instead." },
        { status: 429 }
      );
    }
  } catch {
    // If the rate-limit check itself fails, don't block a real enquiry over it.
  }

  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      name,
      phone,
      email,
      service,
      travel_date: travelDate,
      passengers,
      message,
      status: "new",
      source,
      source_ip: ip,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_content: body.utm_content || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to insert enquiry:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong saving your enquiry. Please try WhatsApp instead." },
      { status: 500 }
    );
  }

  // Alert dispatch by SMS + email using the existing, already-deployed
  // Supabase Edge Function (create-enquiry) - reused as-is rather than
  // duplicating SMS/email logic here. A failure here must not fail the
  // enquiry itself, since it's already saved.
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseAnonKey) {
    try {
      await fetch(`${supabaseUrl}/functions/v1/create-enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseAnonKey}` },
        body: JSON.stringify({
          name,
          phone,
          email,
          route: SERVICE_LABELS[service] || service,
          // create-enquiry requires a truthy `date` field to send its
          // alert - our travel_date is optional on this form, so fall
          // back to a placeholder rather than silently losing the SMS/
          // email notification when a visitor hasn't picked a date yet.
          date: travelDate || "Not specified",
          passengers: String(passengers),
          message,
        }),
      });
    } catch (err) {
      console.error("Failed to trigger create-enquiry alert:", err);
    }
  }

  return NextResponse.json({ success: true, id: data?.id });
}
