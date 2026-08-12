const ITEMS = [
  {
    title: "24/7 Service",
    desc: "We're here whenever you need us.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    title: "Safe & Reliable",
    desc: "Your safety is our top priority.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z" />
      </svg>
    ),
  },
  {
    title: "Professional Drivers",
    desc: "Experienced, friendly and professional.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1-4 4-6.5 7.5-6.5s6.5 2.5 7.5 6.5" />
      </svg>
    ),
  },
  {
    title: "Modern Fleet",
    desc: "Clean, comfortable vehicles.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 11 6.5 6.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
        <rect x="2.5" y="11" width="19" height="6.5" rx="2" />
        <circle cx="7" cy="19.5" r="1.8" />
        <circle cx="17" cy="19.5" r="1.8" />
      </svg>
    ),
  },
];

export default function TrustBand() {
  return (
    <section className="band" aria-labelledby="trust-heading">
      <div className="container">
        <div className="band-head">
          <div className="eyebrow">Why Choose Us</div>
          <h2 id="trust-heading">Trusted by Travellers Across South Africa &amp; Eswatini</h2>
        </div>
        <div className="feature-grid">
          {ITEMS.map((item) => (
            <div className="feature-row on-dark" key={item.title} style={{ flexDirection: "column", textAlign: "center", alignItems: "center" }}>
              <div className="icon-chip on-dark" aria-hidden="true">
                {item.icon}
              </div>
              <h4 style={{ color: "#fff", marginTop: 12, fontSize: 14 }}>{item.title}</h4>
              <p style={{ marginTop: 4 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
