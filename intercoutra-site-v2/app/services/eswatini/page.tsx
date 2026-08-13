import type { Metadata } from "next";
import Image from "next/image";
import EnquiryForm from "@/components/EnquiryForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrustBand from "@/components/TrustBand";
import { COMFORT_PACK_ITEMS } from "@/components/ComfortPackIcons";
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

const HERO_HIGHLIGHTS = [
  {
    title: "Comfort Pack Included",
    desc: "Water, snacks, wet wipes",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8l1.5-4h13L20 8" />
        <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8z" />
        <path d="M9 12a3 3 0 0 0 6 0" />
      </svg>
    ),
  },
  {
    title: "Wi-Fi On Board",
    desc: "Stay connected",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8.5a16 16 0 0 1 20 0" />
        <path d="M5.5 12.5a11 11 0 0 1 13 0" />
        <path d="M9 16.5a6 6 0 0 1 6 0" />
        <circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Daily Departures",
    desc: "On time, every day",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3.5 10h17" />
      </svg>
    ),
  },
];

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

              <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 24 }}>
                {HERO_HIGHLIGHTS.map((h) => (
                  <div className="feature-row on-dark" key={h.title}>
                    <div className="icon-chip on-dark sm" aria-hidden="true">
                      {h.icon}
                    </div>
                    <div>
                      <h4 style={{ color: "#fff" }}>{h.title}</h4>
                      <p>{h.desc}</p>
                    </div>
                  </div>
                ))}
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

      <section className="section" style={{ paddingBottom: 30 }}>
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
                <span className="icon-chip on-dark sm" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><circle cx="12" cy="8" r="0.5" fill="currentColor" /></svg>
                </span>
                <div>
                  O.R. Tambo pickup depends on your flight arrival time, subject to availability —
                  share your flight details when you enquire.
                </div>
              </div>
            </div>

            <div id="enquiry-form">
              <EnquiryForm service="eswatini" compact title="Book Your Seat Today!" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center", display: "flex", marginBottom: 22 }}>
            Comfort Pack Included
          </div>
          <div className="icon-strip">
            {COMFORT_PACK_ITEMS.map((c) => (
              <div className="item" key={c.label}>
                <span className="icon-chip sm" aria-hidden="true">
                  {c.icon}
                </span>
                {c.label}
              </div>
            ))}
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
