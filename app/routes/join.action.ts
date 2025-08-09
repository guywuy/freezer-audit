import { createFileRoute, redirect } from "@tanstack/react-router";
import { createUser, getUserByUsername } from "~/models/user.server";
import { createUserSession } from "~/session.server";
import { safeRedirect, validateUsername } from "~/utils";

export const Route = createFileRoute("/join/action")({
  action: async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

    if (!validateUsername(username)) {
      return new Response(
        JSON.stringify({
          errors: { username: "Username is invalid", password: null },
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

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return new Response(
        JSON.stringify({
          errors: {
            username: "A user already exists with this username",
            password: null,
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const user = await createUser(username, password);

    throw createUserSession({
      redirectTo,
      remember: false,
      request,
      userId: user.id,
    });
  },
});
