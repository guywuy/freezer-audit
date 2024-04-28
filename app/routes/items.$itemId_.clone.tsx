import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { cloneItem } from "~/models/item.server";
import { requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  invariant(params.itemId, "itemId not found");

  await cloneItem({ id: params.itemId, userId });

  return redirect(`/items`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return redirect(`/items`);
};
