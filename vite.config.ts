import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    TanStackRouterVite(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  define: {
    "process.env": {},
  },
});
