import type { Metadata } from "next";
import Image from "next/image";
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

export default function AirportTransferPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Airport Transfers</div>
          <h1>Airport Transfers</h1>
          <p>{service.tagline}</p>
          <div className="hero-actions" style={{ marginTop: 22 }}>
            <a href="#enquiry-form" className="btn btn-red">
              Get a Quote
            </a>
            <WhatsAppButton
              message={service.whatsappMessage}
              className="btn btn-whatsapp"
              placement="airport_hero"
            />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Airports We Operate From</div>
            <h2>Four Major Airports</h2>
          </div>
          <div className="cards-grid">
            {AIRPORTS.map((a) => (
              <div className="service-card" key={a.code} style={{ padding: 22 }}>
                <h3 style={{ fontSize: 16, marginBottom: 4 }}>{a.name}</h3>
                <p className="text-muted" style={{ fontSize: 13 }}>{a.code}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col">
            <div>
              <div style={{ position: "relative", height: 320, borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="eyebrow">Why Fly With Us</div>
              <h2 style={{ marginBottom: 14 }}>Reliable From Landing to Drop-off</h2>
              <ul className="benefits" style={{ fontSize: 14 }}>
                {service.benefits.map((b) => (
                  <li key={b} style={{ marginBottom: 10 }}>{b}</li>
                ))}
              </ul>
            </div>
            <div id="enquiry-form">
              <EnquiryForm service="airport" />
            </div>
          </div>
        </div>
      </section>

      <TrustBand />
    </>
  );
}
