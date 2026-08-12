import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: "center", padding: "100px 24px" }}>
      <div className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>
        404
      </div>
      <h1 style={{ marginBottom: 12 }}>Page Not Found</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>
        That page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link href="/" className="btn btn-red">
        Back to Home
      </Link>
    </section>
  );
}
