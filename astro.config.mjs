import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://salowtech.com",
  output: "static",
  trailingSlash: "never",
  compressHTML: true,
  image: {
    domains: ["images.unsplash.com", "salowtech.com"],
    remotePatterns: [{ protocol: "https" }]
  },
  build: {
    format: "directory",
    inlineStylesheets: "auto"
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover"
  }
});
