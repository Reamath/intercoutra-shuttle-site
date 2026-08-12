"use client";

import { whatsappLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export default function WhatsAppButton({
  message,
  label = "Chat on WhatsApp",
  className = "btn btn-whatsapp",
  placement,
}: {
  message: string;
  label?: string;
  className?: string;
  placement: string;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent("whatsapp_click", { placement })}
    >
      {label}
    </a>
  );
}
