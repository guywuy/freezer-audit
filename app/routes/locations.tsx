import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { getLocationListItems } from "~/models/location.server";
import { requireUserId } from "~/session.server";

export const Route = createFileRoute("/locations")({
  loader: async ({ context }) => {
    const userId = await requireUserId(context.request);
    const locationListItems = await getLocationListItems({ userId });
    return { locationListItems };
  },
  component: LocationsPage,
});

function LocationsPage() {
  const { locationListItems } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleDelete = async (locationId: string) => {
    await fetch(`/locations/${locationId}/delete`, {
      method: "POST",
    });
    navigate({ to: "/locations" });
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 pl-2 text-white">
        <Link
          to="/items"
          className="rounded-sm bg-slate-600 px-4 py-2 text-gray-50 hover:bg-blue-500 active:bg-blue-600"
        >
          Back to items
        </Link>
        <Link
          to="/locations/new"
          className="rounded-sm text-green-600 border-2 border-current font-bold px-4 py-2 block p-4 text-xl bg-linear-to-bl from-green-100 to-green-50"
        >
          + New Location
        </Link>
      </header>

      <main className="flex flex-col h-full">
        <div className="flex-1 basis-1/5 flex flex-col overflow-auto">
          <ol className="grid gap-2.5 px-2 divide-y divide-gray-100">
            {locationListItems.length > 0 ? (
              locationListItems.map((location) => (
                <li
                  key={location.id}
                  className="px-2 py-4 flex justify-between items-center"
                >
                  <p className="text-lg font-bold">{location.title}</p>
                  <button
                    onClick={() => handleDelete(location.id)}
                    className="text-sm btn bg-red-800!"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <li>
                No locations yet.
                <Link
                  to="/locations/new"
                  className="rounded-sm text-green-600 border-2 border-current font-bold px-4 py-2 block p-4 text-xl bg-linear-to-bl from-green-100 to-green-50 mt-6"
                  id="new"
                >
                  + New Location
                </Link>
              </li>
            )}
          </ol>
        </div>

        <div
          className={`max-h-screen fixed min-h-[60vh] h-auto bottom-0 left-0 w-full border-t-4 border-l-4 empty:hidden flex-1 p-6 rounded-tl-xl overflow-auto shadow-top bg-fuchsia-50 border-fuchsia-600 bg-noise`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
