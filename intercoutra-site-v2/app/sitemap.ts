import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/services/airport", priority: 0.9, freq: "weekly" as const },
    { path: "/services/eswatini", priority: 0.9, freq: "weekly" as const },
    { path: "/services/soweto", priority: 0.8, freq: "monthly" as const },
    { path: "/services/cape-town", priority: 0.8, freq: "monthly" as const },
    { path: "/about", priority: 0.5, freq: "monthly" as const },
    { path: "/contact", priority: 0.7, freq: "monthly" as const },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
