import Image from "next/image";
import Link from "next/link";
import type { ServiceInfo } from "@/lib/site";

export default function ServiceCard({ service }: { service: ServiceInfo }) {
  return (
    <Link href={`/services/${service.slug}`} className="service-card">
      <div className="photo-wrap">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="body">
        <h3>{service.name}</h3>
        <p className="desc">{service.description}</p>
        <ul className="check-list" style={{ marginBottom: 16 }}>
          {service.benefits.slice(0, 4).map((b) => (
            <li key={b}>
              <span className="tick" aria-hidden="true">
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>
        <div className="card-actions">
          <span className="link" style={{ color: "var(--red)", fontWeight: 700, fontSize: 13.5 }}>
            Enquire Now →
          </span>
        </div>
      </div>
    </Link>
  );
}
