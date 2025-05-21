import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.ts",
      name: "FeedbackWidget",
      fileName: () => "widget.js",
      formats: ["iife"],
    },
    outDir: "../public/widget",
    emptyOutDir: false,
  },
});
