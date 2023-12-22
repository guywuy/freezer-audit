import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getItemListItems } from "~/models/item.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const itemListItems = await getItemListItems({ userId });
  return json({ itemListItems });
};

export default function ItemsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  const categoryList = data.itemListItems.reduce(
    (catOb, item) => {
      if (catOb[item.category]) {
        catOb[item.category].push(item);
      } else {
        catOb[item.category] = [item];
      }
      return catOb;
    },
    {} as Record<
      string,
      {
        id: string;
        title: string;
        amount: string;
        location: string;
        category: string;
        needsMore: boolean | null;
      }[]
    >,
  );

  const categoryKeys = Object.keys(categoryList);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>

        <Link
          to="new"
          className="rounded bg-green-700 px-4 py-2 block p-4 text-xl text-white"
        >
          + New Item
        </Link>
      </header>

      <main className="flex flex-col h-full bg-white">
        <div className="flex-1 basis-1/5 flex flex-col bg-gray-50 overflow-auto">
          {categoryKeys.length === 0 ? (
            <p className="p-4">No items yet</p>
          ) : (
            <ol>
              {categoryKeys.map((category) => (
                <li key={category} className="border-t-4 border-teal-400 pb-4">
                  <h3 className="text-lg px-2 py-4 bg-teal-50 uppercase">
                    {category}
                  </h3>
                  <ol className="mb-2 divide-y divide-fuchsia-200">
                    {categoryList[category].map((item) => (
                      <li key={item.id}>
                        <NavLink
                          className={({ isActive }) =>
                            `block p-2 py-3 text-lg ${
                              isActive ? "bg-fuchsia-100" : ""
                            }`
                          }
                          to={item.id}
                        >
                          {item.title}
                          <ul className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-800">
                            <li>
                              <span className="font-thin">Amount: </span>
                              {item.amount}
                            </li>
                            <li>
                              <span className="font-thin">Location: </span>
                              {item.location}
                            </li>
                          </ul>
                        </NavLink>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 basis-4/5 p-6 empty:hidden overflow-auto shadow-top bg-fuchsia-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
