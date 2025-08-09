import { createFileRoute, redirect } from "@tanstack/react-router";
import invariant from "tiny-invariant";
import { deleteItem } from "~/models/item.server";
import { requireUserId } from "~/session.server";

export const Route = createFileRoute("/items/$itemId/delete/action")({
  action: async ({ request, params }) => {
    const userId = await requireUserId(request);
    invariant(params.itemId, "itemId not found");

    await deleteItem({ id: params.itemId, userId });

    throw redirect({ to: "/items" });
  },
});
