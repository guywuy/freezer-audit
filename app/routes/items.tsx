import { Item } from "@prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getItemListItems } from "~/models/item.server";
import { requireUserId } from "~/session.server";
import { categoryInfos } from "~/shared";

export const meta: MetaFunction = () => [{ title: "Freezer audit" }];

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

  const downloadFile = ({
    data,
    fileName,
    fileType,
  }: {
    data: string;
    fileName: string;
    fileType: string;
  }) => {
    const blob = new Blob([data], { type: fileType });

    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };
  const exportToCsv = () => {
    // Headers for each column
    const headers = ["Title,Amount,Location,Category,OutOfStock"];

    // Convert items data to a csv
    const itemsCSV = data.itemListItems
      .sort((a, b) => (a.category > b.category ? -1 : 1))
      .reduce((acc, item) => {
        const { title, amount, location, category, needsMore } = item;
        acc.push(
          [
            title.replace(/,/g, ""),
            amount,
            location,
            category,
            needsMore ? "Yes" : "No",
          ].join(","),
        );
        return acc;
      }, [] as string[]);

    downloadFile({
      data: [...headers, ...itemsCSV].join("\n"),
      fileName: `freezer-audit-${new Date()
        .toISOString()
        .substring(0, 10)}.csv`,
      fileType: "text/csv",
    });
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 pl-2">
        <details>
          <summary className="text-black p-2 font-bold relative">Menu</summary>
          <nav className="absolute left-0 w-full py-3 mt-1 bg-white border shadow z-10">
            <ul className="flex flex-col gap-4 min-h-[50vh] shadow px-2">
              <li className="pt-4">
                <Link to="/locations" className="btn">
                  Freezer Locations
                </Link>
              </li>
              <li>
                <button className="btn" onClick={exportToCsv}>
                  Export to CSV
                </button>
              </li>
              <li className="mt-auto">
                <Form action="/logout" method="post">
                  <button
                    type="submit"
                    className="rounded bg-slate-600 px-4 py-2 text-gray-50 hover:bg-blue-500 active:bg-blue-600"
                  >
                    Logout
                  </button>
                </Form>
              </li>
            </ul>
          </nav>
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
              <summary className="font-bold p-2">We need to restock...</summary>
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
            <p className="p-4">
              No items yet. Try adding a freezer location in the menu, then add
              some items.
            </p>
          ) : (
            <ol className="mt-12">
              {usedCategoriesInOrder.map((category) => (
                <li key={category.name} className="-mt-8" id={category.slug}>
                  <header
                    className={`sticky top-0 pl-2 pr-4 py-4 gap-4 flex items-center justify-between rounded-tl-xl border-t-4 border-l-4 ${
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
