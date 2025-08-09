import { createFileRoute, redirect } from "@tanstack/react-router";
import { logout } from "~/session.server";

export const Route = createFileRoute("/logout")({
  loader: async ({ context }) => {
    await logout(context.request);
    throw redirect({
      to: "/",
    });
  },
});
