import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { commitSession, getSession, getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const flash = session.get("globalMessage") || null;

  return json(
    { user: await getUser(request), flash },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
};

export default function App() {
  const { flash } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (flash) {
      if (flash.type === "SUCCESS") {
        toast.success(flash.message, {
          position: "top-left",
          icon: flash.message === "Deleted!" ? "💀" : undefined,
        });
      }
      if (flash.type === "ERROR") {
        toast.error(flash.message, {
          position: "top-left",
        });
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
        <Meta />
        <Links />
      </head>
      <body className="h-full max-w-4xl mx-auto bg-gray-50 scroll-pt-20 scroll-mt-20 scroll-smooth">
        <Toaster />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
