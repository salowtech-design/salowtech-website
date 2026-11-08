import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://salowtech.com",
  output: "static",
  trailingSlash: "never",
  compressHTML: true,
  build: {
    format: "directory",
    inlineStylesheets: "auto"
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover"
  }
});
