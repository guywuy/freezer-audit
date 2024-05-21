import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { markItemNeedsMore } from "~/models/item.server";
import { commitSession, getSession } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const needsMore =
    formData.get("needsmore") && formData.get("needsmore") === "true"
      ? true
      : false;

  invariant(params.itemId, "itemId not found");

  await markItemNeedsMore({ id: params.itemId, needsMore });

  const session = await getSession(request.headers.get("Cookie"));

  session.flash("globalMessage", {
    type: "SUCCESS",
    message: `Updated!`,
  });

  return redirect(`/items/${params.itemId}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return redirect(`/items/${params.itemId}`);
};
