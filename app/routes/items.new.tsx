import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import BackToIndex from "~/components/backToIndex";
import { createItem } from "~/models/item.server";
import { requireUserId } from "~/session.server";
import { categoryNames } from "~/shared";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const amount = formData.get("amount");
  const location = formData.get("location");
  const category = formData.get("category");

  const errors = {
    title: null,
    amount: null,
    location: null,
    category: null,
  };

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { ...errors, title: "Title is required" } },
      { status: 400 },
    );
  }

  if (typeof amount !== "string" || amount.length === 0) {
    return json(
      { errors: { ...errors, amount: "Amount is required" } },
      { status: 400 },
    );
  }

  if (typeof location !== "string" || location.length === 0) {
    return json(
      { errors: { ...errors, location: "Location is required" } },
      { status: 400 },
    );
  }

  if (typeof category !== "string" || category.length === 0) {
    return json(
      { errors: { ...errors, category: "Category is required" } },
      { status: 400 },
    );
  }

  await createItem({
    userId,
    title,
    amount,
    location,
    category,
    needsMore: false,
  });

  return redirect(`/items`);
};

export default function NewItemPage() {
  const actionData = useActionData<typeof action>();

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Add an item</h3>
        <BackToIndex />
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            // ref={titleRef}
            name="title"
            required
            className="flex-1 rounded"
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
            // ref={amountRef}
            name="amount"
            required
            className="flex-1 rounded"
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
          <span>Location: </span>
          <select
            name="location"
            required
            className="flex-1 rounded"
            aria-invalid={actionData?.errors?.location ? true : undefined}
            aria-errormessage={
              actionData?.errors?.location ? "location-error" : undefined
            }
          >
            <option value="Kitchen" label="Kitchen" />
            <option value="Cellar" label="Cellar" />
          </select>
        </label>
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Category: </span>
          <select
            name="category"
            className="flex-1 rounded"
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
  );
}
