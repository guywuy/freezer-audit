import { reactRouter } from "@react-router/dev/vite";
import { installGlobals } from "react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    reactRouter({
      ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"]
    }),
    tsconfigPaths(),
    tailwindcss(),
  ],
});
