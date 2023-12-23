import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteItem } from "~/models/item.server";
import { requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.itemId, "itemId not found");

  await deleteItem({ id: params.itemId, userId });

  return null;
};

export const loader = async () => redirect("/items");
