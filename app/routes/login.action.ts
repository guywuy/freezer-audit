import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyLogin } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { safeRedirect, validateUsername } from "~/utils";

export const Route = createFileRoute("/login/action")({
  action: async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
    const remember = formData.get("remember");

    if (!validateUsername(username)) {
      return new Response(
        JSON.stringify({
          errors: { username: "Email is invalid", password: null },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (typeof password !== "string" || password.length === 0) {
      return new Response(
        JSON.stringify({
          errors: { username: null, password: "Password is required" },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({
          errors: { username: null, password: "Password is too short" },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const user = await verifyLogin(username, password);

    if (!user) {
      return new Response(
        JSON.stringify({
          errors: { username: "Invalid username or password", password: null },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    throw createUserSession({
      redirectTo,
      remember: remember === "on" ? true : false,
      request,
      userId: user.id,
    });
  },
});
