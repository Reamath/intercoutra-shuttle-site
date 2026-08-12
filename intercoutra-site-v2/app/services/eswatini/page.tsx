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

const ROUTE_STEPS = [
  { t: "07:00", d: "Sandton Gautrain Station — departure" },
  { t: "O.R. Tambo", d: "Pickup subject to availability" },
  { t: "12:00", d: "Mbabane — arrival" },
  { t: "13:00", d: "Manzini — arrival" },
  { t: "14:00", d: "Return departure from Eswatini" },
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
          <div className="eyebrow" style={{ color: "#e6484f" }}>
            Johannesburg ↔ Eswatini
          </div>
          <h1>Shared Shuttle to Eswatini</h1>
          <p className="lede">{service.tagline}</p>

          <div className="price-row">
            <div className="price-card">
              <div className="amount">R{ESWATINI_FARE.oneWay}</div>
              <div className="label">One Way, per passenger</div>
            </div>
            <div className="price-card">
              <div className="amount">R{ESWATINI_FARE.returnTotal}</div>
              <div className="label">
                Return, per passenger — <span className="save">save R{ESWATINI_FARE.savings}</span>
              </div>
            </div>
          </div>

          <div className="hero-actions" style={{ marginTop: 12 }}>
            <a href="#enquiry-form" className="btn btn-red">
              Enquire Now
            </a>
            <WhatsAppButton
              message={service.whatsappMessage}
              className="btn btn-whatsapp"
              placement="eswatini_hero"
            />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 36 }}>
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Our Route</div>
            <h2>How the Journey Works</h2>
          </div>
          <div className="route-steps">
            {ROUTE_STEPS.map((s) => (
              <div className="route-step" key={s.t}>
                <div className="t">{s.t}</div>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
          <div className="notice-box">
            <span aria-hidden="true">ℹ️</span>
            <div>
              Passengers flying into O.R. Tambo can be collected based on their flight arrival time,
              subject to availability. Share your flight details when you enquire.
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="two-col">
            <div>
              <div className="eyebrow">Travel in Comfort</div>
              <h2 style={{ marginBottom: 14 }}>Every Passenger Gets a Comfort Pack</h2>
              <p className="text-muted" style={{ marginBottom: 16, fontSize: 14.5 }}>
                A cross-border trip should feel like more than a taxi ride.
              </p>
              <ul className="benefits" style={{ fontSize: 14 }}>
                {service.benefits.map((b) => (
                  <li key={b} style={{ marginBottom: 10 }}>{b}</li>
                ))}
              </ul>
            </div>
            <div id="enquiry-form">
              <EnquiryForm service="eswatini" />
            </div>
          </div>
        </div>
      </section>

      <TrustBand />
    </>
  );
}
