import type { Metadata } from "next";
import Image from "next/image";
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

export default function CapeTownPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Tours</div>
          <h1>Cape Town Tours</h1>
          <p>{service.tagline}</p>
          <div className="hero-actions" style={{ marginTop: 22 }}>
            <a href="#enquiry-form" className="btn btn-red">
              Plan My Tour
            </a>
            <WhatsAppButton message={service.whatsappMessage} className="btn btn-whatsapp" placement="cape_town_hero" />
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
              <div className="eyebrow">What&apos;s Included</div>
              <h2 style={{ marginBottom: 14 }}>Explore the Mother City</h2>
              <ul className="benefits" style={{ fontSize: 14 }}>
                {service.benefits.map((b) => (
                  <li key={b} style={{ marginBottom: 10 }}>{b}</li>
                ))}
              </ul>
            </div>
            <div id="enquiry-form">
              <EnquiryForm service="cape-town" />
            </div>
          </div>
        </div>
      </section>

      <TrustBand />
    </>
  );
}
