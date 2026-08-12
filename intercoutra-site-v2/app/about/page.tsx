import type { Metadata } from "next";
import Image from "next/image";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Intercoutra is a family-run South African transport company founded in 2019, providing shuttle, airport transfer and tour services across South Africa and Eswatini.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">About Us</div>
          <h1>Family-Run, Built on Trust</h1>
          <p>Who we are, our story, and what we do.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col">
            <div>
              <p className="text-muted" style={{ fontSize: 14.5 }}>
                Intercoutra was founded in 2019 — a family-owned and family-run business built on a
                simple idea: transport people could actually rely on. Our flagship service is the
                daily cross-border shuttle between Johannesburg and Eswatini, and we also provide
                airport transfers across four major South African airports, plus guided tours in
                Johannesburg/Soweto and Cape Town.
              </p>
              <p className="text-muted mt-24" style={{ fontSize: 14.5 }}>
                Every relationship starts the same way — an open door. We treat the people we drive
                as partners, not passengers, and our team carries that same standard into every
                trip, every day.
              </p>
            </div>
            <div style={{ position: "relative", height: 320, borderRadius: 12, overflow: "hidden" }}>
              <Image
                src="/images/fleet/bmw-320i-4.jpg"
                alt="Intercoutra vehicle"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
