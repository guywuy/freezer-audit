import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import SubpageHeader from "~/components/subpageHeader";
import { getLocationListItems } from "~/models/location.server";
import { requireUserId } from "~/session.server";
import { categoryNames } from "~/shared";
import { nameToSlug } from "~/utils";

export const Route = createFileRoute("/items/new")({
  loader: async ({ context }) => {
    const userId = await requireUserId(context.request);
    const locationListItems = await getLocationListItems({ userId });
    return { locationListItems };
  },
  component: NewItemPage,
});

function NewItemPage() {
  const { locationListItems } = Route.useLoaderData();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/items/new/action", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const category = formData.get("category") as string;
      navigate({ to: `/items#${nameToSlug(category)}` });
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
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
            name="title"
            required
            className="flex-1 rounded-sm"
            autoFocus
            aria-invalid={errors?.title ? true : undefined}
            aria-errormessage={errors?.title ? "title-error" : undefined}
          />
        </label>
        {errors?.title ? (
          <div className="pt-1 text-red-700" id="title-error">
            {errors.title}
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
            aria-invalid={errors?.amount ? true : undefined}
            aria-errormessage={errors?.amount ? "amount-error" : undefined}
          />
        </label>
        {errors?.amount ? (
          <div className="pt-1 text-red-700" id="amount-error">
            {errors.amount}
          </div>
        ) : null}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Category: </span>
          <select
            name="category"
            className="flex-1 rounded-sm"
            aria-invalid={errors?.category ? true : undefined}
            aria-errormessage={
              errors?.category ? "category-error" : undefined
            }
          >
            {categoryNames.map((c) => (
              <option value={c} label={c} key={c} />
            ))}
          </select>
        </label>
        {errors?.category ? (
          <div className="pt-1 text-red-700" id="category-error">
            {errors.category}
          </div>
        ) : null}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Notes: </span>
          <input name="notes" defaultValue={""} className="flex-1 rounded-sm" />
        </label>
        {errors?.notes ? (
          <div className="pt-1 text-red-700" id="notes-error">
            {errors.notes}
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
            aria-invalid={errors?.location ? true : undefined}
            aria-errormessage={
              errors?.location ? "location-error" : undefined
            }
          >
            {locationListItems.length > 0 ? (
              locationListItems.map((loc) => (
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
    </form>
  );
}
