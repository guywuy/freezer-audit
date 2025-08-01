import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";

import { deleteLocation } from "~/models/location.server";
import { requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.locationId, "locationId not found");

  await deleteLocation({ id: params.locationId, userId });

  return null;
};

export const loader = async () => redirect("/locations");
