import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import invariant from "tiny-invariant";

import { deleteItem } from "~/models/item.server";
import { commitSession, getSession, requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = await requireUserId(request);
  invariant(params.itemId, "itemId not found");

  await deleteItem({ id: params.itemId, userId });

  session.flash("globalMessage", {
    type: "SUCCESS",
    message: `Deleted!`,
  });

  return redirect("/items", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const loader = async () => redirect("/items");
