import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { cloneItem } from "~/models/item.server";
import { commitSession, getSession, requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  invariant(params.itemId, "itemId not found");

  await cloneItem({ id: params.itemId, userId });

  const session = await getSession(request.headers.get("Cookie"));

  session.flash("globalMessage", {
    type: "SUCCESS",
    message: `Cloned!`,
  });

  return redirect(`/items`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const loader = async () => {
  return redirect(`/items`);
};
