import { createFileRoute, redirect } from "@tanstack/react-router";
import { createItem } from "~/models/item.server";
import { commitSession, getSession, requireUserId } from "~/session.server";
import { nameToSlug } from "~/utils";

export const Route = createFileRoute("/items/new/action")({
  action: async ({ request }) => {
    const userId = await requireUserId(request);

    const formData = await request.formData();
    const title = formData.get("title");
    const amount = formData.get("amount");
    const location = formData.get("location");
    const category = formData.get("category");
    const notes = formData.get("notes");

    const errors = {
      title: null,
      amount: null,
      notes: null,
      location: null,
      category: null,
    };

    if (typeof title !== "string" || title.length === 0) {
      return new Response(
        JSON.stringify({ errors: { ...errors, title: "Title is required" } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (typeof amount !== "string" || amount.length === 0) {
      return new Response(
        JSON.stringify({ errors: { ...errors, amount: "Amount is required" } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (typeof location !== "string" || location.length === 0) {
      return new Response(
        JSON.stringify({
          errors: { ...errors, location: "Location is required" },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (typeof category !== "string" || category.length === 0) {
      return new Response(
        JSON.stringify({
          errors: { ...errors, category: "Category is required" },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (typeof notes !== "string") {
      return new Response(
        JSON.stringify({ errors: { ...errors, notes: "Notes should be text" } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    await createItem({
      userId,
      title,
      amount,
      notes,
      location,
      category,
      needsMore: false,
    });

    const session = await getSession(request.headers.get("Cookie"));

    session.flash("globalMessage", {
      type: "SUCCESS",
      message: `${title} added!`,
    });

    throw redirect({
      to: `/items#${nameToSlug(category)}`,
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  },
});
