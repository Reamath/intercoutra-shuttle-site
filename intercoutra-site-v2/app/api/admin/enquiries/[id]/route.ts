import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const VALID_STATUSES = new Set(["new", "contacted", "quoted", "booked", "lost"]);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status = String(body.status || "");

  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ success: false, error: "Invalid status." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);

  if (error) {
    console.error("Failed to update enquiry status:", error);
    return NextResponse.json({ success: false, error: "Failed to update status." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
