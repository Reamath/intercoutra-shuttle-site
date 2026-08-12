import Image from "next/image";
import Link from "next/link";
import type { ServiceInfo } from "@/lib/site";
import WhatsAppButton from "./WhatsAppButton";

export default function ServiceCard({ service }: { service: ServiceInfo }) {
  return (
    <div className="service-card">
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
        <ul className="benefits">
          {service.benefits.slice(0, 4).map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="card-actions">
          <Link href={`/services/${service.slug}`} className="btn btn-red btn-sm">
            Enquire Now
          </Link>
          <WhatsAppButton
            message={service.whatsappMessage}
            className="btn btn-outline-dark btn-sm"
            placement={`home_card_${service.slug}`}
            label="WhatsApp"
          />
        </div>
      </div>
    </div>
  );
}
