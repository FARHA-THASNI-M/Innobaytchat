import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  jsx: "react",
  css: {
    postcss: path.resolve(__dirname, "./postcss.config.js"),
  },
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
  },
});
