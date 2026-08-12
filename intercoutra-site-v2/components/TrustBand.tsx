const ITEMS = [
  { title: "Safe & Secure", desc: "Your safety is our top priority, always." },
  { title: "Always On Time", desc: "Punctual, reliable and professional service." },
  { title: "Comfortable Rides", desc: "Modern, well-maintained vehicles." },
  { title: "24/7 Support", desc: "We're here for you anytime, anywhere." },
];

export default function TrustBand() {
  return (
    <section className="band" aria-labelledby="trust-heading">
      <div className="container">
        <div className="band-head">
          <div className="eyebrow">Why Choose Us</div>
          <h2 id="trust-heading">Your Journey, Our Priority</h2>
        </div>
        <div className="band-grid">
          {ITEMS.map((item) => (
            <div className="band-item" key={item.title}>
              <div className="ic" aria-hidden="true">
                ●
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
