import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrustBand from "@/components/TrustBand";
import { SERVICES, SITE_URL } from "@/lib/site";

const service = SERVICES.soweto;
const url = `${SITE_URL}/services/soweto`;

export const metadata: Metadata = {
  title: "Johannesburg & Soweto Tours | Apartheid Museum, Township Tours",
  description:
    "Guided Johannesburg and Soweto tours including the Apartheid Museum, township tour, local markets and iconic landmarks. Professional guides, flexible tour options.",
  alternates: { canonical: url },
  openGraph: {
    title: "Johannesburg / Soweto Tours | Intercoutra",
    description: service.tagline,
    url,
    images: [service.image],
  },
};

const HIGHLIGHTS = [
  { title: "Apartheid Museum", desc: "Learn about South Africa's history." },
  { title: "Soweto Township", desc: "Experience the heart and culture." },
  { title: "Local Markets", desc: "Visit vibrant local markets and communities." },
  { title: "Iconic Landmarks", desc: "See Johannesburg's most famous sites." },
];

export default function SowetoPage() {
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
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="photo-hero-inner">
          <div className="eyebrow" style={{ color: "var(--red-light)" }}>
            Discover. Learn. Experience.
          </div>
          <h1>
            Johannesburg / Soweto <span style={{ color: "var(--red-light)" }}>Tours</span>
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
              Plan My Tour
            </a>
            <WhatsAppButton message={service.whatsappMessage} className="btn btn-whatsapp" placement="soweto_hero" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head" style={{ textAlign: "center", margin: "0 auto 30px" }}>
            <div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>
              Tour Highlights
            </div>
            <h2>What&apos;s Included</h2>
          </div>
          <div className="tile-grid" style={{ marginBottom: 44 }}>
            {HIGHLIGHTS.map((h) => (
              <div className="tile" key={h.title}>
                <div className="icon-chip" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 21V7l8-4 8 4v14" />
                    <path d="M9 21v-6h6v6" />
                  </svg>
                </div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </div>
            ))}
          </div>

          <div className="two-col" id="enquiry-form">
            <EnquiryForm service="soweto" compact title="Enquire About a Tour" />
            <div style={{ position: "relative", minHeight: 320, borderRadius: 12, overflow: "hidden" }}>
              <Image
                src="/images/routes/sandton.jpg"
                alt="Johannesburg"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="dark-cta">
            <div className="dark-cta-copy">
              <div className="eyebrow">Ready to Explore?</div>
              <h3>Let&apos;s Plan Your Tour</h3>
              <p>Chat with us on WhatsApp for more information and bookings.</p>
              <div className="dark-cta-actions">
                <WhatsAppButton message={service.whatsappMessage} className="btn btn-whatsapp" placement="soweto_bottom_cta" />
                <Link href="#enquiry-form" className="btn btn-red">
                  Enquire Now
                </Link>
              </div>
            </div>
            <div className="dark-cta-photo">
              <Image src="/images/fleet/bmw-320d-2.jpg" alt="Intercoutra vehicle" fill sizes="40vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      <TrustBand />
    </>
  );
}
