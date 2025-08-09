import { createFileRoute, redirect } from "@tanstack/react-router";
import { createLocation } from "~/models/location.server";
import { requireUserId } from "~/session.server";

export const Route = createFileRoute("/locations/new/action")({
  action: async ({ request }) => {
    const userId = await requireUserId(request);

    const formData = await request.formData();
    const title = formData.get("title");

    const errors = {
      title: null,
    };

    if (typeof title !== "string" || title.length === 0) {
      return new Response(
        JSON.stringify({ errors: { ...errors, title: "Title is required" } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    await createLocation({
      userId,
      title,
    });

    throw redirect({ to: "/locations" });
  },
});
