import Link from "next/link";
import Image from "next/image";
import { CONTACT } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Image
              src="/images/logo-intercoutra-white.png"
              alt="Intercoutra"
              width={150}
              height={48}
              style={{ height: 48, width: "auto", marginBottom: 12 }}
            />
            <p style={{ fontSize: 13.5, maxWidth: 260 }}>
              Premium shuttle, airport transfers and tours across South Africa and Eswatini.
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><Link href="/services/airport">Airport Transfers</Link></li>
              <li><Link href="/services/eswatini">Eswatini Shuttle</Link></li>
              <li><Link href="/services/soweto">JHB/Soweto Tours</Link></li>
              <li><Link href="/services/cape-town">Cape Town Tours</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <ul>
              <li>{CONTACT.phonePrimary}</li>
              <li>{CONTACT.phoneSecondary}</li>
              <li>{CONTACT.email}</li>
              <li>{CONTACT.location}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} Intercoutra Shuttle Services. All rights reserved. ·{" "}
          <Link href="/privacy" style={{ textDecoration: "underline" }}>Privacy Policy (POPIA)</Link> ·{" "}
          <Link href="/terms" style={{ textDecoration: "underline" }}>Terms &amp; Conditions</Link>
        </div>
        <div>Licensed cross-border operator</div>
      </div>
    </footer>
  );
}
