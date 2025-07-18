import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

installGlobals();

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    remix({
      future: {
        v3_relativeSplatPath: true,
        v3_singleFetch: true,
      },
      ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"]
    }),
    tsconfigPaths(),
    tailwindcss(),
  ],
});
