import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  data,
  redirect,
  Form,
  useActionData,
  useLoaderData,
} from "react-router";

import SubpageHeader from "~/components/subpageHeader";
import { createItem } from "~/models/item.server";
import { getLocationListItems } from "~/models/location.server";
import { commitSession, getSession, requireUserId } from "~/session.server";
import { categoryNames } from "~/shared";
import { nameToSlug } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const locationListItems = await getLocationListItems({ userId });
  return { locationListItems };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const amount = formData.get("amount");
  const location = formData.get("location");
  const category = formData.get("category");
  const notes = formData.get("notes");

  const errors = {
    title: null,
    amount: null,
    notes: null,
    location: null,
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

  if (typeof notes !== "string") {
    return data(
      { errors: { ...errors, notes: "Notes should be text" } },
      { status: 400 },
    );
  }

  await createItem({
    userId,
    title,
    amount,
    notes,
    location,
    category,
    needsMore: false,
  });

  const session = await getSession(request.headers.get("Cookie"));

  session.flash("globalMessage", {
    type: "SUCCESS",
    message: `${title} added!`,
  });

  return redirect(`/items#${nameToSlug(category)}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function NewItemPage() {
  const data = useLoaderData<typeof loader>();
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
      <SubpageHeader title="Add an item" />
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            // ref={titleRef}
            name="title"
            required
            className="flex-1 rounded-sm"
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
            className="flex-1 rounded-sm"
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
          <span>Category: </span>
          <select
            name="category"
            className="flex-1 rounded-sm"
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
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Notes: </span>
          <input name="notes" defaultValue={""} className="flex-1 rounded-sm" />
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
            aria-invalid={actionData?.errors?.location ? true : undefined}
            aria-errormessage={
              actionData?.errors?.location ? "location-error" : undefined
            }
          >
            {data.locationListItems.length > 0 ? (
              data.locationListItems.map((loc) => (
                <option key={loc.title} value={loc.title} label={loc.title} />
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

      <div className="text-right mt-8">
        <button type="submit" className="btn">
          Save
        </button>
      </div>
    </Form>
  );
}
