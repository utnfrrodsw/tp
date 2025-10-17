import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    open: "/virtual-benefits/",
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/virtual-benefits/", // 👈 asegura que los assets carguen desde /virtual-benefits/
  build: {
    outDir: "../public/virtual-benefits", // 👈 el build se genera en el backend
    emptyOutDir: true,
  },
}))
