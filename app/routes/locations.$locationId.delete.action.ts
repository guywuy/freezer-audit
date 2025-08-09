import { createFileRoute, redirect } from "@tanstack/react-router";
import invariant from "tiny-invariant";
import { deleteLocation } from "~/models/location.server";
import { requireUserId } from "~/session.server";

export const Route = createFileRoute("/locations/$locationId/delete/action")({
  action: async ({ request, params }) => {
    const userId = await requireUserId(request);
    invariant(params.locationId, "locationId not found");

    await deleteLocation({ id: params.locationId, userId });

    throw redirect({ to: "/locations" });
  },
});
