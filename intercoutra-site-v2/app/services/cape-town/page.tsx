import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrustBand from "@/components/TrustBand";
import { SERVICES, SITE_URL } from "@/lib/site";

const service = SERVICES["cape-town"];
const url = `${SITE_URL}/services/cape-town`;

export const metadata: Metadata = {
  title: "Cape Town Tours | Table Mountain, Winelands, Cape Peninsula",
  description:
    "Guided Cape Town tours covering Table Mountain, the V&A Waterfront, Cape Peninsula and the Winelands. Experienced guides, custom tour options.",
  alternates: { canonical: url },
  openGraph: {
    title: "Cape Town Tours | Intercoutra",
    description: service.tagline,
    url,
    images: [service.image],
  },
};

const HIGHLIGHTS = [
  { title: "Table Mountain", desc: "Take in breathtaking views." },
  { title: "V&A Waterfront", desc: "Shop, dine and enjoy the vibe." },
  { title: "Cape Peninsula", desc: "Scenic coastal drives and nature." },
  { title: "Winelands", desc: "Experience world-class wines." },
];

export default function CapeTownPage() {
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
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="hero-inner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 30, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 380px", minWidth: 0 }}>
              <div className="eyebrow" style={{ color: "var(--red-light)" }}>
                Experience the Beauty
              </div>
              <h1>
                Cape Town <span style={{ color: "var(--red-light)" }}>Tours</span>
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
                <WhatsAppButton message={service.whatsappMessage} className="btn btn-whatsapp" placement="cape_town_hero" />
              </div>
            </div>
            <div style={{ flex: "0 0 300px" }} id="enquiry-form">
              <EnquiryForm service="cape-town" compact title="Plan Your Cape Town Adventure" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head" style={{ textAlign: "center", margin: "0 auto 30px" }}>
            <div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>
              Tour Highlights
            </div>
            <h2>Explore the Mother City</h2>
          </div>
          <div className="tile-grid">
            {HIGHLIGHTS.map((h) => (
              <div className="tile" key={h.title}>
                <div className="icon-chip" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 20l6-12 4 7 3-5 5 10z" />
                  </svg>
                </div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="dark-cta">
            <div className="dark-cta-copy">
              <div className="eyebrow">Let&apos;s Make It Unforgettable</div>
              <h3>Your Cape Town Experience Starts Here</h3>
              <p>Chat with us on WhatsApp or send an enquiry today.</p>
              <div className="dark-cta-actions">
                <WhatsAppButton message={service.whatsappMessage} className="btn btn-whatsapp" placement="cape_town_bottom_cta" />
                <Link href="#enquiry-form" className="btn btn-red">
                  Enquire Now
                </Link>
              </div>
            </div>
            <div className="dark-cta-photo">
              <Image src="/images/fleet/bmw-msport-1.jpg" alt="Intercoutra vehicle" fill sizes="40vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      <TrustBand />
    </>
  );
}
