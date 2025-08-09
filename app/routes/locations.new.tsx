import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import SubpageHeader from "~/components/subpageHeader";

export const Route = createFileRoute("/locations/new")({
  component: NewLocationPage,
});

function NewLocationPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/locations/new/action", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      navigate({ to: "/locations" });
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
      <SubpageHeader title="Add a location" backTo="/locations" />
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            name="title"
            required
            className="flex-1 rounded-sm"
            placeholder="e.g. Chest"
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

      <div className="text-right mt-8">
        <button type="submit" className="btn">
          Save
        </button>
      </div>
    </form>
  );
}
