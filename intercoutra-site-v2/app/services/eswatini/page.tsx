import type { Metadata } from "next";
import Image from "next/image";
import EnquiryForm from "@/components/EnquiryForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrustBand from "@/components/TrustBand";
import { SERVICES, SITE_URL, ESWATINI_FARE } from "@/lib/site";

const service = SERVICES.eswatini;
const url = `${SITE_URL}/services/eswatini`;

export const metadata: Metadata = {
  title: "Johannesburg to Eswatini Shuttle | Daily Departures from R850",
  description:
    "Daily shared shuttle from Sandton/O.R. Tambo to Mbabane & Manzini, Eswatini. R850 one way, R1,600 return. Comfort Pack and Wi-Fi included on every seat.",
  alternates: { canonical: url },
  openGraph: {
    title: "Shared Shuttle to Eswatini | Intercoutra",
    description:
      "Daily shared shuttle from Sandton/O.R. Tambo to Mbabane & Manzini, Eswatini. R850 one way, R1,600 return.",
    url,
    images: [service.image],
  },
};

export default function EswatiniPage() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 55%" }}
          />
        </div>
        <div className="hero-inner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 30, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 380px", minWidth: 0 }}>
              <div className="eyebrow" style={{ color: "#e6484f" }}>
                Safe, Affordable &amp; Comfortable
              </div>
              <h1>
                Shared Shuttle
                <br />
                to <span style={{ color: "var(--red-light)" }}>Eswatini</span>
              </h1>
              <p className="lede">{service.tagline}</p>
              <div className="icon-strip" style={{ background: "transparent", border: "none", padding: 0, justifyContent: "flex-start", gap: 22, marginBottom: 22 }}>
                <div className="item" style={{ color: "#fff" }}>💧🍪🧻 Comfort Pack Included</div>
                <div className="item" style={{ color: "#fff" }}>📶 Wi-Fi On Board</div>
                <div className="item" style={{ color: "#fff" }}>📅 Daily Departures</div>
              </div>
              <div className="hero-actions">
                <a href="#enquiry-form" className="btn btn-red">
                  Enquire Now
                </a>
                <WhatsAppButton message={service.whatsappMessage} className="btn btn-whatsapp" placement="eswatini_hero" />
              </div>
            </div>

            <div className="pricing-card-dark" style={{ flex: "0 0 240px", boxShadow: "0 30px 60px -24px rgba(0,0,0,.6)" }}>
              <div className="tier one-way">
                <div className="lbl">Pricing · One Way</div>
                <div className="amt">R{ESWATINI_FARE.oneWay}</div>
              </div>
              <div className="tier return">
                <div className="lbl">Return Trip</div>
                <div className="amt">
                  R{ESWATINI_FARE.oneWay} + R{ESWATINI_FARE.returnLeg}
                </div>
                <div className="save">Save R{ESWATINI_FARE.savings}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col">
            <div className="dark-card">
              <div className="eyebrow" style={{ color: "var(--red-light)" }}>
                Departure &amp; Arrival Times
              </div>
              <div className="dc-row" style={{ marginTop: 16 }}>
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
              <div className="dc-divider" />
              <div className="dc-row" style={{ marginBottom: 0 }}>
                <div className="icon-chip on-dark sm" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                </div>
                <div>
                  <h3>Return (Eswatini to SA)</h3>
                  <p>Departs Manzini 02:00 PM — back to Sandton</p>
                </div>
              </div>

              <div className="notice-box" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", color: "#cfcfcf" }}>
                <span aria-hidden="true">ℹ️</span>
                <div>
                  O.R. Tambo pickup depends on your flight arrival time, subject to availability —
                  share your flight details when you enquire.
                </div>
              </div>

              <div className="icon-strip" style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", marginTop: 18 }}>
                <div className="item" style={{ color: "#fff" }}>💧 Water</div>
                <div className="item" style={{ color: "#fff" }}>🍪 Snacks</div>
                <div className="item" style={{ color: "#fff" }}>🧻 Wet Wipes</div>
                <div className="item" style={{ color: "#fff" }}>📶 Wi-Fi Onboard</div>
              </div>
            </div>

            <div id="enquiry-form">
              <EnquiryForm service="eswatini" compact title="Book Your Seat Today!" />
            </div>
          </div>
        </div>
      </section>

      <div className="cta-strip">
        <div className="container">
          <div className="cta-inner">
            <div>
              <h3>Have Questions?</h3>
              <p>Chat with us on WhatsApp and we'll answer right away.</p>
            </div>
            <div className="cta-actions">
              <WhatsAppButton message={service.whatsappMessage} className="btn btn-white" placement="eswatini_bottom_cta" />
              <a href="#enquiry-form" className="btn btn-outline">
                Enquire Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <TrustBand />
    </>
  );
}
