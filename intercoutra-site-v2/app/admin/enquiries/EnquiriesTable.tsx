"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  travel_date: string | null;
  passengers: number;
  message: string | null;
  status: string;
  source: string;
  created_at: string;
}

const STATUSES = ["new", "contacted", "quoted", "booked", "lost"];

const SERVICE_LABELS: Record<string, string> = {
  airport: "Airport Transfer",
  eswatini: "Eswatini Shuttle",
  soweto: "JHB/Soweto Tour",
  "cape-town": "Cape Town Tour",
};

export default function EnquiriesTable({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    const prev = enquiries;
    setEnquiries((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("update failed");
    } catch {
      setEnquiries(prev); // revert on failure
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const visible = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
        <label htmlFor="statusFilter" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)" }}>
          Filter:
        </label>
        <select
          id="statusFilter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #e2e2e2" }}
        >
          <option value="all">All ({enquiries.length})</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s} ({enquiries.filter((e) => e.status === s).length})
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-outline-dark btn-sm" style={{ marginLeft: "auto" }} onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", fontSize: 13.5 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line-dark)" }}>
              <th style={{ padding: "10px 12px" }}>Date</th>
              <th style={{ padding: "10px 12px" }}>Name</th>
              <th style={{ padding: "10px 12px" }}>Phone</th>
              <th style={{ padding: "10px 12px" }}>Service</th>
              <th style={{ padding: "10px 12px" }}>Travel Date</th>
              <th style={{ padding: "10px 12px" }}>Pax</th>
              <th style={{ padding: "10px 12px" }}>Message</th>
              <th style={{ padding: "10px 12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid var(--line-dark)" }}>
                <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                  {new Date(e.created_at).toLocaleDateString("en-ZA")}
                </td>
                <td style={{ padding: "10px 12px" }}>{e.name}</td>
                <td style={{ padding: "10px 12px" }}>
                  <a href={`https://wa.me/${e.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                    {e.phone}
                  </a>
                </td>
                <td style={{ padding: "10px 12px" }}>{SERVICE_LABELS[e.service] || e.service}</td>
                <td style={{ padding: "10px 12px" }}>{e.travel_date || "—"}</td>
                <td style={{ padding: "10px 12px" }}>{e.passengers}</td>
                <td style={{ padding: "10px 12px", maxWidth: 220 }}>{e.message || "—"}</td>
                <td style={{ padding: "10px 12px" }}>
                  <select
                    value={e.status}
                    disabled={updatingId === e.id}
                    onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                    style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #e2e2e2" }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>
                  No enquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
