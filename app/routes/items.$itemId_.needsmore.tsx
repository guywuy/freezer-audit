import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { markItemNeedsMore } from "~/models/item.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const needsMore =
    formData.get("needsmore") && formData.get("needsmore") === "true"
      ? true
      : false;

  invariant(params.itemId, "itemId not found");

  await markItemNeedsMore({ id: params.itemId, needsMore });

  return redirect(`/items/${params.itemId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.log({ params });
  return redirect(`/items/${params.itemId}`);
};
