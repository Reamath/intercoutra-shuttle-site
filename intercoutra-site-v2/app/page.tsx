import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SERVICE_LIST, SITE_URL, ESWATINI_FARE } from "@/lib/site";
import ServiceCard from "@/components/ServiceCard";
import TrustBand from "@/components/TrustBand";
import WhatsAppButton from "@/components/WhatsAppButton";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Shuttle, Airport Transfers & Tours | South Africa & Eswatini",
  description:
    "Premium shuttle, airport transfers and tours across South Africa and Eswatini. Safe, reliable, comfortable - chat on WhatsApp for a quote.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Intercoutra | Shuttle, Airport Transfers & Tours",
    description:
      "Premium shuttle, airport transfers and tours across South Africa and Eswatini. Safe, reliable, comfortable.",
    url: SITE_URL,
    images: ["/images/fleet/vito-1.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      <section className="split-hero">
        <div className="split-hero-inner">
          <div className="split-hero-copy">
            <div className="eyebrow">Safe. Reliable. Comfortable.</div>
            <h1>
              Your Journey,
              <br />
              <span style={{ color: "var(--red-light)" }}>Our Priority.</span>
            </h1>
            <p className="lede">
              Premium shuttle, airport transfers and tours across South Africa and Eswatini.
            </p>
            <div className="hero-badge-row">
              <div className="feature-row on-dark">
                <div className="icon-chip on-dark sm" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                </div>
                <div>
                  <h4 style={{ color: "#fff" }}>Punctual</h4>
                  <p>On time, every time</p>
                </div>
              </div>
              <div className="feature-row on-dark">
                <div className="icon-chip on-dark sm" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" /><rect x="3" y="11" width="18" height="6" rx="2" /></svg>
                </div>
                <div>
                  <h4 style={{ color: "#fff" }}>Comfortable</h4>
                  <p>Modern vehicles</p>
                </div>
              </div>
              <div className="feature-row on-dark">
                <div className="icon-chip on-dark sm" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1-4 4-6.5 7.5-6.5s6.5 2.5 7.5 6.5" /></svg>
                </div>
                <div>
                  <h4 style={{ color: "#fff" }}>Professional</h4>
                  <p>Experienced drivers</p>
                </div>
              </div>
            </div>
            <div className="hero-actions">
              <WhatsAppButton
                message="Hi Intercoutra, I'd like to enquire about your services."
                className="btn btn-whatsapp btn-lg"
                placement="hero_primary"
                label="Chat on WhatsApp"
              />
              <Link href="/contact" className="btn btn-outline btn-lg">
                Enquire Now
              </Link>
            </div>
          </div>
          <div className="split-hero-photo">
            <Image
              src="/images/fleet/vito-1.jpg"
              alt="Intercoutra Mercedes-Benz Vito Tourer"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head" style={{ textAlign: "center", margin: "0 auto 36px" }}>
            <div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>
              Our Services
            </div>
            <h2>How Can We Take You There?</h2>
          </div>
          <div className="cards-grid">
            {SERVICE_LIST.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="spotlight-grid">
            <div className="dark-card">
              <div className="eyebrow" style={{ color: "var(--red-light)" }}>
                Shared Shuttle Service
              </div>
              <h2 style={{ color: "#fff", fontSize: 24, marginBottom: 10 }}>
                Sandton / O.R. Tambo to Eswatini and Back
              </h2>
              <p style={{ color: "#cfcfcf", fontSize: 13.5, marginBottom: 22, maxWidth: 420 }}>
                Our shared shuttle is the most convenient and affordable way to travel to Eswatini.
              </p>

              <div className="dc-row">
                <div className="icon-chip on-dark sm" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                </div>
                <div>
                  <h3>Departure (SA)</h3>
                  <p>07:00 AM — Sandton Gautrain Station (O.R. Tambo pickup if available)</p>
                </div>
              </div>
              <div className="dc-row">
                <div className="icon-chip on-dark sm" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
                </div>
                <div>
                  <h3>Arrival (Eswatini)</h3>
                  <p>12:00 PM Mbabane · 01:00 PM Manzini</p>
                </div>
              </div>
              <div className="dc-row" style={{ marginBottom: 0 }}>
                <div className="icon-chip on-dark sm" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                </div>
                <div>
                  <h3>Return (Eswatini to SA)</h3>
                  <p>Departure: 02:00 PM back to Sandton</p>
                </div>
              </div>

              <div className="dc-divider" />

              <div className="pricing-card-dark" style={{ marginBottom: 18 }}>
                <div className="tier one-way">
                  <div className="lbl">One Way</div>
                  <div className="amt">R{ESWATINI_FARE.oneWay}</div>
                </div>
                <div className="tier return">
                  <div className="lbl">Return Trip</div>
                  <div className="amt">R{ESWATINI_FARE.returnTotal}</div>
                  <div className="save">Save R{ESWATINI_FARE.savings}</div>
                </div>
              </div>

              <div className="icon-strip" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)" }}>
                <div className="item" style={{ color: "#fff" }}>💧 Water</div>
                <div className="item" style={{ color: "#fff" }}>🍪 Snacks</div>
                <div className="item" style={{ color: "#fff" }}>🧻 Wet Wipes</div>
                <div className="item" style={{ color: "#fff" }}>📶 Wi-Fi Onboard</div>
              </div>
              <div style={{ marginTop: 18 }}>
                <Link href="/services/eswatini" className="link" style={{ color: "var(--red-light)", fontWeight: 600, fontSize: 13.5 }}>
                  View full route &amp; schedule →
                </Link>
              </div>
            </div>

            <EnquiryForm service="eswatini" compact />
          </div>
        </div>
      </section>

      <TrustBand />

      <div className="cta-strip">
        <div className="container">
          <div className="cta-inner">
            <div>
              <h3>Ready to travel?</h3>
              <p>Chat with us on WhatsApp for a fast, no-obligation quote.</p>
            </div>
            <div className="cta-actions">
              <WhatsAppButton
                message="Hi Intercoutra, I'd like to enquire about your services."
                className="btn btn-white"
                placement="home_bottom_cta"
                label="Chat on WhatsApp"
              />
              <Link href="/contact" className="btn btn-outline">
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
