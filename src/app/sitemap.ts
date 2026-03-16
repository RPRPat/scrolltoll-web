import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://scrolltoll.me",
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://scrolltoll.me/privacy",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://scrolltoll.me/terms",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://scrolltoll.me/deck",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
