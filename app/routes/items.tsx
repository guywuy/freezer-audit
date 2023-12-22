import { Item } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getItemListItems } from "~/models/item.server";
import { requireUserId } from "~/session.server";
import { categoryInfos } from "~/shared";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const itemListItems = await getItemListItems({ userId });
  return json({ itemListItems });
};

export default function ItemsPage() {
  const data = useLoaderData<typeof loader>();

  const categoryList = data.itemListItems.reduce(
    (catOb, item) => {
      if (catOb[item.category]) {
        catOb[item.category].push(item);
      } else {
        catOb[item.category] = [item];
      }
      return catOb;
    },
    {} as Record<string, Partial<Item>[]>,
  );

  const categoryKeys = Object.keys(categoryList);
  const usedCategoriesInOrder = categoryInfos.filter(
    (cat) => categoryList[cat.name],
  );

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
        <div className="flex-1 basis-1/5 flex flex-col bg-gray-50 pt-4 overflow-auto">
          {categoryKeys.length === 0 ? (
            <p className="p-4">No items yet</p>
          ) : (
            <ol>
              {usedCategoriesInOrder.map((category) => (
                <li key={category.name} className="-mt-6">
                  <header
                    className={`pl-2 pr-4 py-4 gap-4 flex items-center justify-between rounded-tl-xl border-t-4 border-l-2 ${
                      category.bgColourClass || "bg-teal-400"
                    } ${category.borderColourClass || "bg-teal-50"}`}
                  >
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-2xl">{category.emoji}</p>
                  </header>
                  <ol
                    className={`mb-2 divide-y divide-fuchsia-200 border-l-2 last:pb-6 ${
                      category.borderColourClass || "border-teal-400"
                    }`}
                  >
                    {categoryList[category.name].map((item) => (
                      <li key={item.id}>
                        <NavLink
                          className={({ isActive }) =>
                            `block p-2 py-3 text-xl bg-opacity-50 ${
                              isActive ? "bg-fuchsia-100" : ""
                            }`
                          }
                          to={item.id!}
                        >
                          {item.title}
                          <ul className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-900">
                            <li>
                              <span className="font-thin text-gray-700">
                                Amount:{" "}
                              </span>
                              {item.amount}
                            </li>
                            <li>
                              <span className="font-thin text-gray-700">
                                Location:{" "}
                              </span>
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

        <div
          className={`max-h-screen fixed min-h-[60vh] h-auto bottom-0 left-0 w-full border-t-4 border-l-2 empty:hidden flex-1 p-6 rounded-tl-xl overflow-auto shadow-top bg-fuchsia-50 border-fuchsia-600 bg-noise`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
