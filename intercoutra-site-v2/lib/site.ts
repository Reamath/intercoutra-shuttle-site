// Central place for brand facts that appear across multiple pages, so a
// phone number or fare only ever needs to change in one place.

export const SITE_URL = "https://www.intercoutra.co.za";

export const CONTACT = {
  phonePrimary: "+27 74 351 8384",
  phoneSecondary: "+27 66 286 9427",
  whatsappNumber: "27743518384", // no leading +, wa.me format
  email: "bookings@intercoutra.co.za",
  location: "South Africa",
};

export type ServiceSlug = "airport" | "eswatini" | "soweto" | "cape-town";

export interface ServiceInfo {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  benefits: string[];
  image: string;
  imageAlt: string;
  whatsappMessage: string;
  ctaLabel: string;
}

export const SERVICES: Record<ServiceSlug, ServiceInfo> = {
  airport: {
    slug: "airport",
    name: "Airport Transfers",
    shortName: "Airport Transfers",
    tagline:
      "Reliable, comfortable and professional airport transfers from four major airports across South Africa.",
    description:
      "Door-to-door transfers to and from Cape Town International, O.R. Tambo, Lanseria and King Shaka International airports.",
    benefits: [
      "Flight monitoring",
      "Meet & greet available",
      "Transparent pricing",
      "24/7 availability",
      "Professional drivers",
      "Comfortable vehicles",
    ],
    image: "/images/fleet/vito-1.jpg",
    imageAlt: "Intercoutra Mercedes-Benz Vito Tourer used for airport transfers",
    whatsappMessage: "Hi Intercoutra, I'd like to enquire about an airport transfer.",
    ctaLabel: "Get a Quote",
  },
  eswatini: {
    slug: "eswatini",
    name: "Shared Shuttle to Eswatini",
    shortName: "Eswatini Shuttle",
    tagline: "Sandton / O.R. Tambo to Mbabane & Manzini and back.",
    description:
      "Our daily shared shuttle between Johannesburg and Eswatini, with fixed pick-up points and a Comfort Pack on every seat.",
    benefits: [
      "Comfort Pack included (water, snacks, wet wipes)",
      "Free Wi-Fi onboard",
      "Daily departures",
      "Professional drivers",
    ],
    image: "/images/fleet/vito-2.jpg",
    imageAlt: "Intercoutra Mercedes-Benz Vito Tourer used on the Eswatini shuttle route",
    whatsappMessage: "Hi Intercoutra, I'd like to enquire about the shared shuttle to Eswatini.",
    ctaLabel: "Enquire Now",
  },
  soweto: {
    slug: "soweto",
    name: "Johannesburg / Soweto Tours",
    shortName: "JHB & Soweto Tours",
    tagline: "Explore the rich history, culture and heritage of Johannesburg and Soweto.",
    description:
      "Guided tours across Johannesburg and Soweto, including the Apartheid Museum and other iconic landmarks.",
    benefits: [
      "Apartheid Museum",
      "Soweto township tour",
      "Local markets",
      "Iconic landmarks",
      "Professional guides",
      "Flexible tour options",
    ],
    image: "/images/hero-fleet-jhb-skyline.png",
    imageAlt: "Johannesburg skyline",
    whatsappMessage: "Hi Intercoutra, I'd like to enquire about a Johannesburg/Soweto tour.",
    ctaLabel: "Plan My Tour",
  },
  "cape-town": {
    slug: "cape-town",
    name: "Cape Town Tours",
    shortName: "Cape Town Tours",
    tagline: "Experience the Mother City with professional, comfortable and guided tours.",
    description:
      "Guided tours across Cape Town and the Peninsula, from Table Mountain to the Winelands.",
    benefits: [
      "Table Mountain",
      "V&A Waterfront",
      "Cape Peninsula",
      "Winelands",
      "Scenic routes",
      "Experienced guides",
      "Custom tour options",
    ],
    image: "/images/routes/cape-town.jpg",
    imageAlt: "Cape Town coastline",
    whatsappMessage: "Hi Intercoutra, I'd like to enquire about a Cape Town tour.",
    ctaLabel: "Plan My Tour",
  },
};

export const SERVICE_LIST = Object.values(SERVICES);

// Note: these are the confirmed, real fares live in the booking backend
// (tested via real bookings) - R850 one-way, R750 return leg, R1,600 total
// return, saving R100 vs two one-way fares. Do not change without
// confirming with Adrian/Lawrence first.
export const ESWATINI_FARE = {
  oneWay: 850,
  returnLeg: 750,
  returnTotal: 1600,
  savings: 100,
};
