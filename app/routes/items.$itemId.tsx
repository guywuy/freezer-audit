import {
  createFileRoute,
  useNavigate,
  ErrorComponent,
} from "@tanstack/react-router";
import { useState } from "react";
import invariant from "tiny-invariant";
import SubpageHeader from "~/components/subpageHeader";
import { getItem, updateItem } from "~/models/item.server";
import { getLocationListItems } from "~/models/location.server";
import { requireUserId } from "~/session.server";
import { categoryNames } from "~/shared";
import { formatDate } from "~/utils";

export const Route = createFileRoute("/items/$itemId")({
  loader: async ({ params, context }) => {
    const userId = await requireUserId(context.request);
    invariant(params.itemId, "itemId not found");

    const item = await getItem({ id: params.itemId, userId });
    if (!item) {
      throw new Response("Not Found", { status: 404 });
    }
    const locationListItems = await getLocationListItems({ userId });
    return { item, locationListItems, userId };
  },
  errorComponent: ItemErrorComponent,
  component: ItemDetailsPage,
});

function ItemErrorComponent() {
  const error = Route.useRouteError();
  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }
  return <div>An unexpected error occurred</div>;
}

function ItemDetailsPage() {
  const { item, locationListItems } = Route.useLoaderData();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/items/${item.id}`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      navigate({ to: "/items" });
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  };

  const handleNeedsMore = async (needsMore: boolean) => {
    const formData = new FormData();
    formData.append("needsMore", String(needsMore));
    await fetch(`/items/${item.id}/needsmore`, {
      method: "POST",
      body: formData,
    });
    navigate({ to: `/items/${item.id}` });
  };

  const handleDelete = async () => {
    await fetch(`/items/${item.id}/delete`, {
      method: "POST",
    });
    navigate({ to: "/items" });
  };

  const handleClone = async () => {
    await fetch(`/items/${item.id}/clone`, {
      method: "POST",
    });
    navigate({ to: "/items" });
  };

  return (
    <div>
      <SubpageHeader title={item.title} />
      <hr className="mb-4" />
      {item.needsMore ? (
        <>
          <p className="my-6">Out of stock :/</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => handleNeedsMore(false)}
              className="btn bg-green-800!"
            >
              We have it again!
            </button>

            <button
              onClick={() => setShowDelete(!showDelete)}
              className={`btn ${!showDelete && "bg-red-800!"}`}
            >
              {showDelete ? "Cancel" : "Delete"}
            </button>
          </div>
        </>
      ) : showEdit ? (
        <form
          method="post"
          onSubmit={handleEdit}
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
                defaultValue={item.amount}
                aria-invalid={errors?.amount ? true : undefined}
                aria-errormessage={
                  errors?.amount ? "amount-error" : undefined
                }
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
              <span>Notes: </span>
              <input
                name="notes"
                className="flex-1 rounded-sm"
                defaultValue={item.notes || ""}
                aria-invalid={errors?.notes ? true : undefined}
                aria-errormessage={errors?.notes ? "notes-error" : undefined}
              />
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
                defaultValue={item.location}
                aria-invalid={errors?.location ? true : undefined}
                aria-errormessage={
                  errors?.location ? "location-error" : undefined
                }
              >
                {locationListItems.length > 0 ? (
                  locationListItems.map((loc) => (
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

          <div className="text-right mt-8">
            <button type="submit" className="btn">
              Save
            </button>
          </div>
        </form>
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
            <button onClick={handleClone} className="btn bg-amber-500!">
              Clone item
            </button>
            <button onClick={() => setShowEdit(!showEdit)} className={`btn`}>
              Edit
            </button>
          </div>
          <div className="flex mb-2 mt-2">
            <button
              onClick={() => handleNeedsMore(true)}
              className="btn bg-fuchsia-800!"
            >
              We need to buy more
            </button>
          </div>
        </>
      )}
      {showDelete ? (
        <div className="flex justify-end items-center gap-6 mt-6">
          <p className="font-bold text-lg">Are you sure?!</p>
          <button onClick={handleDelete} className="btn bg-red-800!">
            Yes, delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
