import { http, passthrough } from "msw";
import { setupServer } from "msw/node";

// put one-off handlers that don't really need an entire file to themselves here
const miscHandlers = [
  http.post(`${import.meta.env.REMIX_DEV_HTTP_ORIGIN}/ping`, () =>
    passthrough(),
  ),
];

const server = setupServer(...miscHandlers);

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

import.meta.env.once("SIGINT", () => server.close());
import.meta.env.once("SIGTERM", () => server.close());
