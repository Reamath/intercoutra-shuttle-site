import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for enquiries and trips booked with Intercoutra.",
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Terms &amp; Conditions</div>
          <h1>Terms &amp; Conditions</h1>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 style={{ fontSize: 19, marginBottom: 10 }}>1. Enquiries</h2>
          <p className="text-muted mt-24" style={{ fontSize: 14.5, marginBottom: 22 }}>
            Submitting an enquiry through this website or WhatsApp does not confirm a booking or hold
            a seat. It starts a conversation with our team, who will confirm availability, pricing
            and payment arrangements with you directly.
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>2. Fares</h2>
          <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 22 }}>
            Fares shown on this website are per passenger and are subject to change without notice.
            The fare that applies to your trip is the one confirmed with you directly by our team
            before you travel.
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>3. Travel Documents</h2>
          <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 22 }}>
            Cross-border routes require a valid passport for all passengers, including South African
            citizens — a South African ID book or smart ID card is not sufficient for entry into
            Eswatini. It is the passenger&apos;s responsibility to carry valid travel documents.
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>4. Delays</h2>
          <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 22 }}>
            We aim to run all trips on schedule. However, border delays, weather, traffic and
            mechanical issues are sometimes outside our control. We will always communicate known
            delays as early as possible.
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>5. Conduct</h2>
          <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 22 }}>
            Drivers may refuse to carry, or may end the journey of, any passenger who is a safety
            risk to themselves, other passengers, or the driver.
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>6. Your Information</h2>
          <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 22 }}>
            Sending us an enquiry means agreeing to our{" "}
            <a href="/privacy" style={{ color: "var(--red)", fontWeight: 600 }}>
              Privacy Policy
            </a>
            , which explains what information we collect and how it&apos;s used, in line with South
            Africa&apos;s Protection of Personal Information Act (POPIA).
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>7. Contact</h2>
          <p className="text-muted" style={{ fontSize: 14.5 }}>
            bookings@intercoutra.co.za
            <br />
            +27 74 351 8384
          </p>

          <p className="text-muted" style={{ fontSize: 12.5, marginTop: 30, fontStyle: "italic" }}>
            Last updated August 2026. These terms may be updated from time to time as our services evolve.
          </p>
        </div>
      </section>
    </>
  );
}
