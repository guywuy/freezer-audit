import { createFileRoute, redirect } from "@tanstack/react-router";
import invariant from "tiny-invariant";
import { markItemNeedsMore } from "~/models/item.server";

export const Route = createFileRoute("/items/$itemId/needsmore/action")({
  action: async ({ request, params }) => {
    invariant(params.itemId, "itemId not found");
    const formData = await request.formData();
    const needsMore = formData.get("needsMore") === "true";

    await markItemNeedsMore({
      id: params.itemId,
      needsMore,
    });

    throw redirect({ to: `/items/${params.itemId}` });
  },
});
