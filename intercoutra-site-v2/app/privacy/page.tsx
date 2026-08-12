import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Intercoutra collects, uses and protects your personal information, in line with POPIA.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Privacy Policy</div>
          <h1>Privacy Policy (POPIA)</h1>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 style={{ fontSize: 19, marginBottom: 10 }}>What We Collect</h2>
          <p className="text-muted mt-24" style={{ fontSize: 14.5, marginBottom: 22 }}>
            When you send us an enquiry — through this website, WhatsApp or by phone — we collect your
            name, contact number, email address, and details of the trip or tour you&apos;re asking
            about (such as travel dates and number of passengers).
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>Why We Collect It</h2>
          <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 22 }}>
            Your information is used only to respond to your enquiry, discuss your trip, and — if you
            go ahead — arrange your booking directly with our team over WhatsApp, phone or email.
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>Marketing Communication</h2>
          <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 22 }}>
            We will only send you promotional messages or marketing content if you&apos;ve separately
            opted in to receive them. You can withdraw this consent at any time by replying
            &quot;STOP&quot; on WhatsApp or contacting us directly.
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>How We Protect It</h2>
          <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 22 }}>
            Your information is stored securely and only accessed by staff who need it to respond to
            your enquiry. We do not sell, rent, or share your personal information with third parties
            for their own marketing purposes.
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>Your Rights</h2>
          <p className="text-muted" style={{ fontSize: 14.5, marginBottom: 22 }}>
            Under POPIA, you have the right to request access to the personal information we hold
            about you, ask us to correct it, or request that it be deleted, subject to any legal or
            operational requirements we may have to retain certain records.
          </p>

          <h2 style={{ fontSize: 19, marginBottom: 10 }}>Contact Us About Your Information</h2>
          <p className="text-muted" style={{ fontSize: 14.5 }}>
            bookings@intercoutra.co.za
            <br />
            +27 74 351 8384
          </p>

          <p className="text-muted" style={{ fontSize: 12.5, marginTop: 30, fontStyle: "italic" }}>
            This policy was last updated August 2026.
          </p>
        </div>
      </section>
    </>
  );
}
