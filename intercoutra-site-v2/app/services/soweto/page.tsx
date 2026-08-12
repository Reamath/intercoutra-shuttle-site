import type { Metadata } from "next";
import Image from "next/image";
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

export default function SowetoPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Tours</div>
          <h1>Johannesburg / Soweto Tours</h1>
          <p>{service.tagline}</p>
          <div className="hero-actions" style={{ marginTop: 22 }}>
            <a href="#enquiry-form" className="btn btn-red">
              Plan My Tour
            </a>
            <WhatsAppButton message={service.whatsappMessage} className="btn btn-whatsapp" placement="soweto_hero" />
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
              <h2 style={{ marginBottom: 14 }}>History, Culture and Heritage</h2>
              <ul className="benefits" style={{ fontSize: 14 }}>
                {service.benefits.map((b) => (
                  <li key={b} style={{ marginBottom: 10 }}>{b}</li>
                ))}
              </ul>
            </div>
            <div id="enquiry-form">
              <EnquiryForm service="soweto" />
            </div>
          </div>
        </div>
      </section>

      <TrustBand />
    </>
  );
}
