"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

const NAV_LINKS = [
  { href: "/services/airport", label: "Airport Transfers" },
  { href: "/services/eswatini", label: "Eswatini Shuttle" },
  { href: "/services/soweto", label: "JHB/Soweto Tours" },
  { href: "/services/cape-town", label: "Cape Town Tours" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo-intercoutra.png"
            alt="Intercoutra"
            width={160}
            height={56}
            style={{ height: 56, width: "auto" }}
            priority
          />
        </Link>
        <nav className="main-nav" aria-label="Primary">
          <ul>
            <li>
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-cta">
          <a
            href="https://wa.me/27743518384?text=Hi%20Intercoutra%2C%20I%27d%20like%20to%20enquire%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            onClick={() => trackEvent("whatsapp_click", { placement: "nav" })}
          >
            Chat on WhatsApp
          </a>
          <button
            type="button"
            className="hamburger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className={`mobile-nav${open ? " open" : ""}`}>
        <ul>
          <li>
            <Link href="/" onClick={() => setOpen(false)} aria-current={pathname === "/" ? "page" : undefined}>
              Home
            </Link>
          </li>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mnav-cta">
          <a
            href="https://wa.me/27743518384?text=Hi%20Intercoutra%2C%20I%27d%20like%20to%20enquire%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-block"
            onClick={() => setOpen(false)}
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
