import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrustBand from "@/components/TrustBand";
import { SERVICES, SITE_URL } from "@/lib/site";

const service = SERVICES.airport;
const url = `${SITE_URL}/services/airport`;

export const metadata: Metadata = {
  title: "Airport Transfers South Africa | O.R. Tambo, Cape Town, Lanseria, King Shaka",
  description:
    "Reliable, comfortable airport transfers from O.R. Tambo, Cape Town International, Lanseria and King Shaka International. Flight monitoring, meet & greet, 24/7 availability.",
  alternates: { canonical: url },
  openGraph: {
    title: "Airport Transfers | Intercoutra",
    description:
      "Reliable, comfortable airport transfers from four major South African airports. Flight monitoring, meet & greet, 24/7 availability.",
    url,
    images: [service.image],
  },
};

const AIRPORTS = [
  { name: "O.R. Tambo International", code: "JNB" },
  { name: "Cape Town International", code: "CPT" },
  { name: "Lanseria International", code: "HLA" },
  { name: "King Shaka International", code: "DUR" },
];

const WHY_US = [
  { title: "Punctual & Reliable", desc: "We monitor your flight so we're always there on time." },
  { title: "Professional Drivers", desc: "Experienced, friendly and well-vetted." },
  { title: "Comfortable Vehicles", desc: "Modern, clean and spacious vehicles." },
  { title: "24/7 Support", desc: "We're here whenever you need us." },
];

export default function AirportTransferPage() {
  return (
    <>
      <section className="photo-hero">
        <div className="hero-bg">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 60%" }}
          />
        </div>
        <div className="photo-hero-inner">
          <div className="eyebrow" style={{ color: "var(--red-light)" }}>
            On Time, Every Time
          </div>
          <h1>
            Airport <span style={{ color: "var(--red-light)" }}>Transfers</span>
          </h1>
          <p className="lede">{service.tagline}</p>
          <ul className="check-list on-dark" style={{ marginBottom: 24 }}>
            {service.benefits.slice(0, 4).map((b) => (
              <li key={b}>
                <span className="tick" aria-hidden="true">✓</span>
                {b}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <a href="#enquiry-form" className="btn btn-red">
              Get a Quote
            </a>
            <WhatsAppButton message={service.whatsappMessage} className="btn btn-whatsapp" placement="airport_hero" />
          </div>
        </div>
      </section>

      <section className="section" id="enquiry-form">
        <div className="container">
          <div className="section-head" style={{ textAlign: "center", margin: "0 auto 30px" }}>
            <div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>
              Airports We Operate From
            </div>
            <h2>Four Major Airports</h2>
          </div>
          <div className="tile-grid" style={{ marginBottom: 44 }}>
            {AIRPORTS.map((a) => (
              <div className="tile" key={a.code}>
                <div className="icon-chip" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>
                <h3>{a.name}</h3>
                <p>{a.code}</p>
              </div>
            ))}
          </div>

          <div className="two-col">
            <EnquiryForm service="airport" compact title="Get a Quick Quote" />
            <div>
              <div className="eyebrow">Why Choose Intercoutra?</div>
              <h2 style={{ marginBottom: 20 }}>Reliable From Landing to Drop-off</h2>
              <div className="feature-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                {WHY_US.map((f) => (
                  <div className="feature-row" key={f.title}>
                    <div className="icon-chip sm" aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                    </div>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="dark-cta">
            <div className="dark-cta-copy">
              <div className="eyebrow">Need an Airport Transfer?</div>
              <h3>Let Us Take Care of Your Journey</h3>
              <p>Book your reliable, comfortable transfer in minutes.</p>
              <div className="dark-cta-actions">
                <Link href="#enquiry-form" className="btn btn-red">
                  Enquire Now
                </Link>
                <WhatsAppButton message={service.whatsappMessage} className="btn btn-whatsapp" placement="airport_bottom_cta" />
              </div>
            </div>
            <div className="dark-cta-photo">
              <Image src="/images/fleet/vito-2.jpg" alt="Intercoutra vehicle" fill sizes="40vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      <TrustBand />
    </>
  );
}
