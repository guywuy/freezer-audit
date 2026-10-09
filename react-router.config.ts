import type { Config } from "@react-router/dev/config";
export default {
  ssr: true,
  // Fly terminates TLS, so request.url is http:// while the browser's Origin is
  // https://. React Router's action CSRF check compares the full origin, so allow
  // our own hosts explicitly (the check then matches on host only).
  allowedActionOrigins: [
    "freezer.guywuy.com",
    "freezer-audit.fly.dev",
    "freezer-audit-staging.fly.dev",
  ],
} satisfies Config;
