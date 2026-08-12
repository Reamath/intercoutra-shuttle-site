import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import { CONTACT, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Intercoutra for shuttle, airport transfer or tour enquiries.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Contact Us</div>
          <h1>Let&apos;s Get You On the Road</h1>
          <p>Send us your details and we&apos;ll reply by WhatsApp, phone or email — usually within the hour.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col">
            <EnquiryForm />
            <div>
              <div className="enquiry-card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, marginBottom: 6 }}>Phone</h3>
                <p>{CONTACT.phonePrimary}</p>
                <p>{CONTACT.phoneSecondary}</p>
              </div>
              <div className="enquiry-card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, marginBottom: 6 }}>Email</h3>
                <p>{CONTACT.email}</p>
              </div>
              <div className="enquiry-card">
                <h3 style={{ fontSize: 15, marginBottom: 6 }}>Location</h3>
                <p>{CONTACT.location}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
