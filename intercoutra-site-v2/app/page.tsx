import type { Metadata } from "next";
import Image from "next/image";
import { SERVICE_LIST, SITE_URL } from "@/lib/site";
import ServiceCard from "@/components/ServiceCard";
import TrustBand from "@/components/TrustBand";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";

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
      <section className="hero">
        <div className="hero-bg">
          <Image
            src="/images/hero-fleet-jhb-skyline.png"
            alt="Intercoutra shuttle vehicles against the Johannesburg skyline"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 70%" }}
          />
        </div>
        <div className="hero-inner">
          <div className="eyebrow" style={{ color: "#e6484f" }}>
            Safe · Reliable · Comfortable
          </div>
          <h1>Your Journey, Our Priority.</h1>
          <p className="lede">
            Premium shuttle, airport transfers and tours across South Africa and Eswatini.
          </p>
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
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Our Services</div>
            <h2>Four Ways to Travel With Us</h2>
            <p>Whether you&apos;re travelling for business or leisure, we have the right service for you.</p>
          </div>
          <div className="cards-grid">
            {SERVICE_LIST.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
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
