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

  const outOfStock = data.itemListItems.filter((item) => item.needsMore);
  const categoryList = data.itemListItems
    .filter((item) => !item.needsMore)
    .reduce(
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
      <header className="flex items-center justify-between p-4 pl-2 text-white">
        <details>
          <summary className="text-black">Menu</summary>
          <div className="flex gap-4 items-center pt-3">
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded bg-slate-600 px-4 py-2 text-gray-50 hover:bg-blue-500 active:bg-blue-600"
              >
                Logout
              </button>
            </Form>

            <Link to="/locations" className="btn">
              Freezer Locations
            </Link>
          </div>
        </details>

        <Link
          to="new"
          className="rounded text-green-600 border-2 border-current font-bold px-4 py-2 block p-4 text-xl bg-gradient-to-bl from-green-100 to-green-50"
        >
          + New Item
        </Link>
      </header>

      <main className="flex flex-col h-full">
        <div className="flex-1 basis-1/5 flex flex-col overflow-auto">
          {outOfStock.length > 0 ? (
            <details className="w-full border-red-700 border-2 bg-red-50 mb-4">
              <summary className="font-bold p-2">We need to buy...</summary>
              <ul>
                {outOfStock.map((item, index) => (
                  <li key={item.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `block px-2 py-3 my-1 bg-opacity-50 border-t border-slate-200 ${
                          isActive ? "bg-fuchsia-100" : ""
                        }`
                      }
                      to={item.id!}
                    >
                      <span className="inline-flex text-xl mr-2">
                        {index % 4 === 0
                          ? "🥸"
                          : index % 4 === 1
                          ? "🧐"
                          : index % 4 === 2
                          ? "😱"
                          : "🤠"}
                      </span>
                      {item.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}

          <ol className="flex flex-wrap gap-2.5 px-2">
            {usedCategoriesInOrder.map((category) => (
              <Link
                key={category.name}
                to={`#${category.slug}`}
                className={`text-xs p-2 px-3 rounded-full border bg-opacity-50 ${category.borderColourClass} ${category.bgColourClass}`}
              >
                {category.name} &nbsp;{category.emoji}
              </Link>
            ))}
          </ol>

          {categoryKeys.length === 0 ? (
            <p className="p-4">No items yet</p>
          ) : (
            <ol className="mt-12">
              {usedCategoriesInOrder.map((category) => (
                <li key={category.name} className="-mt-8" id={category.slug}>
                  <header
                    className={`pl-2 pr-4 py-4 gap-4 flex items-center justify-between rounded-tl-xl border-t-4 border-l-4 ${
                      category.bgColourClass || "bg-teal-400"
                    } ${category.borderColourClass || "bg-teal-50"}`}
                  >
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-2xl">{category.emoji}</p>
                  </header>
                  <ol
                    className={`mb-2 divide-y divide-fuchsia-200 border-l-4 ${
                      category.borderColourClass || "border-teal-400"
                    }`}
                  >
                    {categoryList[category.name].map((item) => (
                      <li
                        key={item.id}
                        className="last:pb-10 bg-gradient-to-tr from-white to-gray-50"
                      >
                        <NavLink
                          className={({ isActive }) =>
                            `block p-2 py-3 text-xl bg-opacity-50 leading-tight text-balance ${
                              isActive ? "bg-fuchsia-100" : ""
                            }`
                          }
                          to={item.id!}
                        >
                          {item.title}
                          <ul className="mt-1.5 grid grid-cols-2 gap-2 text-xs text-gray-900 font-bold">
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
          className={`max-h-screen fixed min-h-[60vh] h-auto bottom-0 left-0 w-full border-t-4 border-l-4 empty:hidden flex-1 p-6 rounded-tl-xl overflow-auto shadow-top bg-fuchsia-50 border-fuchsia-600 bg-noise`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
