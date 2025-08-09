import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  createRootRoute,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { commitSession, getSession, getUser } from "~/session.server";

export const Route = createRootRoute({
  loader: async ({ context }) => {
    const session = await getSession(context.request.headers.get("Cookie"));
    const flash = session.get("globalMessage") || null;
    const user = await getUser(context.request);
    const headers = { "Set-Cookie": await commitSession(session) };
    return { user, flash, headers };
  },
  component: App,
});

export default function App() {
  const { flash } = Route.useLoaderData();

  useEffect(() => {
    if (flash) {
      if (flash.type === "SUCCESS") {
        toast.success(flash.message, {
          position: "top-left",
          style: { border: "2px solid #0057c6" },
          icon: flash.message === "Deleted!" ? "💀" : undefined,
        });
      }
      if (flash.type === "ERROR") {
        toast.error(flash.message, { position: "top-left" });
      }
    }
  }, [flash]);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/icon.svg" />

        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="h-full max-w-4xl mx-auto bg-gray-50 scroll-pt-20 scroll-mt-20 scroll-smooth">
        <Toaster />
        <Outlet />
      </body>
    </html>
  );
}
