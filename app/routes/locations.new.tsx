import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import SubpageHeader from "~/components/subpageHeader";
import { createLocation } from "~/models/location.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");

  const errors = {
    title: null,
  };

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { ...errors, title: "Title is required" } },
      { status: 400 },
    );
  }

  await createLocation({
    userId,
    title,
  });

  return redirect(`/locations`);
};

export default function NewLocationPage() {
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
      <SubpageHeader title="Add a location" backTo="/locations" />
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            // ref={titleRef}
            name="title"
            required
            className="flex-1 rounded"
            placeholder="e.g. Chest"
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

      <div className="text-right mt-8">
        <button type="submit" className="btn">
          Save
        </button>
      </div>
    </Form>
  );
}
