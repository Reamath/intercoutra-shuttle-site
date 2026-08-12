"use client";

import { useRef, useState } from "react";
import { SERVICE_LIST, type ServiceSlug } from "@/lib/site";
import { trackEvent, getStoredUtm } from "@/lib/analytics";

interface Props {
  /** Pre-selects and locks the service field when set (used on service landing pages). */
  service?: ServiceSlug;
  /** Tighter styling + shorter copy, no message field - used for hero-embedded quick-quote forms. */
  compact?: boolean;
  /** Overrides the heading text (defaults to "Send an Enquiry" / "Book Your Seat Today!" in compact mode). */
  title?: string;
}

export default function EnquiryForm({ service, compact = false, title }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startedRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFirstInteraction() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("enquiry_form_start", { service: service ?? "unspecified" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real visitors never fill this hidden field.
    if (data.get("website")) {
      setStatus("success");
      return;
    }

    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const travelDate = String(data.get("travel_date") || "");
    const passengers = String(data.get("passengers") || "1");
    const message = String(data.get("message") || "").trim();
    const selectedService = service ?? String(data.get("service") || "");

    if (!name) return setErrorMsg("Please enter your full name.");
    if (!phone) return setErrorMsg("Please enter a contact number.");
    if (!phone.startsWith("+")) return setErrorMsg("Please include your country code, e.g. +27 82 000 0000.");
    if (!selectedService) return setErrorMsg("Please choose a service.");

    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || null,
          service: selectedService,
          travel_date: travelDate || null,
          passengers: Number(passengers) || 1,
          message: message || null,
          source: "website",
          ...getStoredUtm(),
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        setStatus("error");
        setErrorMsg(result.error || "Something went wrong sending your enquiry. Please try WhatsApp instead.");
        return;
      }
      trackEvent("enquiry_form_submit", { service: selectedService });
      setStatus("success");
      formRef.current?.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong sending your enquiry. Please try WhatsApp instead.");
    }
  }

  const wrapperClass = compact ? "quick-form-card" : "enquiry-card";

  if (status === "success") {
    return (
      <div className={wrapperClass}>
        <div className="form-success">
          Thanks — your enquiry has been sent. Our team has been alerted and will get back to you
          shortly by WhatsApp, phone or email.
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <h3 style={{ fontSize: 18, marginBottom: 4 }}>{title ?? (compact ? "Book Your Seat Today!" : "Send an Enquiry")}</h3>
      <p className="text-muted" style={{ fontSize: 12.5, marginBottom: 18 }}>
        We'll get back to you by WhatsApp, phone or email — usually within the hour.
      </p>
      <form ref={formRef} onSubmit={handleSubmit} onFocus={handleFirstInteraction} noValidate>
        {/* Honeypot - hidden from real users, bots often fill every field */}
        <div className="honeypot-field" aria-hidden="true">
          <label htmlFor="website">Leave this field blank</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" required autoComplete="name" />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" placeholder="+27 82 000 0000" required autoComplete="tel" />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" autoComplete="email" />
        </div>

        {!service && (
          <div className="form-field">
            <label htmlFor="service">Service</label>
            <select id="service" name="service" required defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {SERVICE_LIST.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.shortName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="travel_date">Travel Date</label>
            <input type="date" id="travel_date" name="travel_date" />
          </div>
          <div className="form-field">
            <label htmlFor="passengers">Passengers</label>
            <select id="passengers" name="passengers" defaultValue="1">
              {[1, 2, 3, 4, 5, 6, "7+"].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!compact && (
          <div className="form-field">
            <label htmlFor="message">Message (optional)</label>
            <textarea id="message" name="message" rows={3} placeholder="Anything else we should know?" />
          </div>
        )}

        {errorMsg && <div className="form-error">{errorMsg}</div>}

        <button type="submit" className="btn btn-red btn-block" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>
      </form>
    </div>
  );
}
