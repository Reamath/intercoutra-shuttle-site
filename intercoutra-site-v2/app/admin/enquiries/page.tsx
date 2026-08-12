import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import EnquiriesTable, { type Enquiry } from "./EnquiriesTable";

export const metadata: Metadata = {
  title: "Enquiries | Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EnquiriesAdminPage() {
  let rows: Enquiry[] = [];
  let loadError: string | null = null;

  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    rows = (data as Enquiry[]) || [];
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load enquiries.";
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div className="eyebrow">Admin</div>
            <h1>Enquiries</h1>
          </div>
        </div>
        {loadError ? (
          <p className="form-error">Failed to load enquiries: {loadError}</p>
        ) : (
          <EnquiriesTable initialEnquiries={rows} />
        )}
      </div>
    </section>
  );
}
