import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  data,
  redirect,
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "react-router";
import invariant from "tiny-invariant";

import SubpageHeader from "~/components/subpageHeader";
import { getItem, updateItem } from "~/models/item.server";
import { getLocationListItems } from "~/models/location.server";
import { requireUserId } from "~/session.server";
import { categoryNames } from "~/shared";
import { formatDate } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.itemId, "itemId not found");

  const item = await getItem({ id: params.itemId, userId });
  if (!item) {
    throw new Response("Not Found", { status: 404 });
  }
  const locationListItems = await getLocationListItems({ userId });
  return { item, locationListItems, userId };
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.itemId, "itemId not found");
  const formData = await request.formData();
  const title = formData.get("title");
  const amount = formData.get("amount");
  const notes = formData.get("notes");
  const location = formData.get("location");
  const category = formData.get("category");

  const errors = {
    title: null,
    amount: null,
    location: null,
    notes: null,
    category: null,
  };

  if (typeof title !== "string" || title.length === 0) {
    return data(
      { errors: { ...errors, title: "Title is required" } },
      { status: 400 },
    );
  }

  if (typeof amount !== "string" || amount.length === 0) {
    return data(
      { errors: { ...errors, amount: "Amount is required" } },
      { status: 400 },
    );
  }

  if (typeof notes !== "string") {
    return data(
      { errors: { ...errors, location: "Notes should be text" } },
      { status: 400 },
    );
  }

  if (typeof location !== "string" || location.length === 0) {
    return data(
      { errors: { ...errors, location: "Location is required" } },
      { status: 400 },
    );
  }

  if (typeof category !== "string" || category.length === 0) {
    return data(
      { errors: { ...errors, category: "Category is required" } },
      { status: 400 },
    );
  }

  await updateItem({
    id: params.itemId,
    title,
    amount,
    notes,
    location,
    category,
  });

  return redirect("/items");
};

export default function ItemDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const { item } = data;
  const actionData = useActionData<typeof action>();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div>
      <SubpageHeader title={item.title} />
      <hr className="mb-4" />
      {item.needsMore ? (
        <>
          <p className="my-6">Out of stock :/</p>
          <div className="flex justify-end gap-4">
            <Form method="post" action={`/items/${item.id}/needsmore`}>
              <input type="hidden" value="false" name="needsmore" />
              <button type="submit" className="btn bg-green-800!">
                We have it again!
              </button>
            </Form>

            <button
              onClick={() => setShowDelete(!showDelete)}
              className={`btn ${!showDelete && "bg-red-800!"}`}
            >
              {showDelete ? "Cancel" : "Delete"}
            </button>
          </div>
        </>
      ) : showEdit ? (
        <Form
          method="post"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Title: </span>
              <input
                name="title"
                required
                className="flex-1 rounded-sm"
                defaultValue={item.title}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                aria-invalid={actionData?.errors?.title ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.title ? "title-error" : undefined
                }
              />
            </label>
            {actionData?.errors?.title ? (
              <div className="pt-1 text-red-700" id="title-error">
                {actionData.errors.title}
              </div>
            ) : null}
          </div>
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Amount: </span>
              <input
                name="amount"
                required
                className="flex-1 rounded-sm"
                defaultValue={item.amount}
                aria-invalid={actionData?.errors?.amount ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.amount ? "amount-error" : undefined
                }
              />
            </label>
            {actionData?.errors?.amount ? (
              <div className="pt-1 text-red-700" id="amount-error">
                {actionData.errors.amount}
              </div>
            ) : null}
          </div>
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Notes: </span>
              <input
                name="notes"
                className="flex-1 rounded-sm"
                defaultValue={item.notes || ""}
                aria-invalid={actionData?.errors?.notes ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.notes ? "notes-error" : undefined
                }
              />
            </label>
            {actionData?.errors?.notes ? (
              <div className="pt-1 text-red-700" id="notes-error">
                {actionData.errors.notes}
              </div>
            ) : null}
          </div>
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Location: </span>
              <select
                name="location"
                required
                className="flex-1 rounded-sm"
                defaultValue={item.location}
                aria-invalid={actionData?.errors?.location ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.location ? "location-error" : undefined
                }
              >
                {data.locationListItems.length > 0 ? (
                  data.locationListItems.map((loc) => (
                    <option
                      key={loc.title}
                      value={loc.title}
                      label={loc.title}
                    />
                  ))
                ) : (
                  <>
                    <option value="Kitchen" label="Kitchen" />
                    <option value="Cellar" label="Cellar" />
                  </>
                )}
              </select>
            </label>
          </div>
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Category: </span>
              <select
                name="category"
                className="flex-1 rounded-sm"
                defaultValue={item.category}
                aria-invalid={actionData?.errors?.category ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.category ? "category-error" : undefined
                }
              >
                {categoryNames.map((c) => (
                  <option value={c} label={c} key={c} />
                ))}
              </select>
            </label>
            {actionData?.errors?.category ? (
              <div className="pt-1 text-red-700" id="category-error">
                {actionData.errors.category}
              </div>
            ) : null}
          </div>

          <div className="text-right mt-8">
            <button type="submit" className="btn">
              Save
            </button>
          </div>
        </Form>
      ) : (
        <>
          <ul className="mb-4 grid font-bold gap-2 text-sm text-gray-800">
            <li>
              <span className="font-thin">Amount: </span>
              {item.amount}
            </li>
            <li className="mb-3">
              <span className="font-thin">Location: </span>
              {item.location}
            </li>
            <li className="mb-3">
              <span className="font-thin">Notes: </span>
              {item.notes}
            </li>
            <li>
              <span className="font-thin">Created at: </span>
              {formatDate(item.createdAt)}
            </li>
            <li>
              <span className="font-thin">Updated at: </span>
              {formatDate(item.updatedAt)}
            </li>
          </ul>
          <div className="flex justify-end gap-2 mb-3 mt-8">
            <button
              onClick={() => setShowDelete(!showDelete)}
              className={`btn ml-auto ${!showDelete && "bg-red-800!"}`}
            >
              {showDelete ? "Cancel" : "Delete"}
            </button>
            <Form method="post" action={`/items/${item.id}/clone`}>
              <button type="submit" className="btn bg-amber-500!">
                Clone item
              </button>
            </Form>
            <button onClick={() => setShowEdit(!showEdit)} className={`btn`}>
              Edit
            </button>
          </div>
          <div className="flex mb-2 mt-2">
            <Form method="post" action={`/items/${item.id}/needsmore`}>
              <input type="hidden" value="true" name="needsmore" />
              <button type="submit" className="btn bg-fuchsia-800!">
                We need to buy more
              </button>
            </Form>
          </div>
        </>
      )}
      {showDelete ? (
        <div className="flex justify-end items-center gap-6 mt-6">
          <p className="font-bold text-lg">Are you sure?!</p>
          <Form method="post" action={`/items/${item.id}/delete`}>
            <button type="submit" className="btn bg-red-800!">
              Yes, delete
            </button>
          </Form>
        </div>
      ) : null}
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
