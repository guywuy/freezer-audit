import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import BackToIndex from "~/components/backToIndex";
import { deleteItem, getItem } from "~/models/item.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.itemId, "itemId not found");

  const item = await getItem({ id: params.itemId, userId });
  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ item });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.itemId, "itemId not found");

  await deleteItem({ id: params.itemId, userId });

  return redirect("/items");
};

export default function ItemDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">{data.item.title}</h3>
        <BackToIndex />
      </div>
      <hr className="my-4" />
      <ul className="mb-4 grid grid-cols-2 gap-2 text-xs text-gray-800">
        <li>
          <span className="font-thin">Amount: </span>
          {data.item.amount}
        </li>
        <li>
          <span className="font-thin">Location: </span>
          {data.item.location}
        </li>
        <li>
          <span className="font-thin">Created at: </span>
          {data.item.createdAt?.substring(0, 10)}
        </li>
        <li>
          <span className="font-thin">Updated at: </span>
          {data.item.updatedAt?.substring(0, 10)}
        </li>
      </ul>
      <div className="flex justify-end gap-2 my-3">
        <Link to={"edit"} className="btn">Edit</Link>
        <Form method="post">
          <button type="submit" className="btn !bg-red-800">
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Item not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
