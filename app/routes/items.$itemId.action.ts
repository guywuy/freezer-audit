import { createFileRoute, redirect } from "@tanstack/react-router";
import invariant from "tiny-invariant";
import { updateItem } from "~/models/item.server";

export const Route = createFileRoute("/items/$itemId/action")({
  action: async ({ request, params }) => {
    invariant(params.itemId, "itemId not found");
    const formData = await request.formData();
    const title = formData.get("title");
    const amount = formData.get("amount");
    const notes = formData.get("notes");
    const location = formData.get("location");
    const category = formData.get("category");

    const errors = {
      title: null,
      amount: null,
      location: null,
      notes: null,
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

    if (typeof notes !== "string") {
      return new Response(
        JSON.stringify({
          errors: { ...errors, location: "Notes should be text" },
        }),
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

    await updateItem({
      id: params.itemId,
      title,
      amount,
      notes,
      location,
      category,
    });

    throw redirect({ to: "/items" });
  },
});
