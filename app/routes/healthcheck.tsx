// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import { createFileRoute } from "@tanstack/react-router";

import { prisma } from "~/db.server";

export const Route = createFileRoute("/healthcheck")({
  loader: async ({ context }) => {
    const host =
      context.request.headers.get("X-Forwarded-Host") ??
      context.request.headers.get("host");

    try {
      const url = new URL("/", `http://${host}`);
      // if we can connect to the database and make a simple query
      // and make a HEAD request to ourselves, then we're good.
      await Promise.all([
        prisma.user.count(),
        fetch(url.toString(), { method: "HEAD" }).then((r) => {
          if (!r.ok) return Promise.reject(r);
        }),
      ]);
      return new Response("OK");
    } catch (error: unknown) {
      console.log("healthcheck ❌", { error });
      return new Response("ERROR", { status: 500 });
    }
  },
});
