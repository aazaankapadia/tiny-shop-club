import type { MetadataRoute } from "next";

const pages = ["", "/privacy", "/terms", "/safety", "/contact", "/login"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `https://www.tinyshopclub.com${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
