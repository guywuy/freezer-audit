import { Item } from "@prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { getItemListItems } from "~/models/item.server";
import { getLocationListItems } from "~/models/location.server";
import { requireUserId } from "~/session.server";
import { categoryInfos } from "~/shared";
import { downloadFile, nameToSlug } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Freezer audit" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const itemListItems = await getItemListItems({ userId });
  const locationListItems = await getLocationListItems({ userId });

  return { itemListItems, locationListItems };
};

export default function ItemsPage() {
  const data = useLoaderData<typeof loader>();
  const [locFilter, setLocFilter] = useState<string | null>(null);
  const [backupRecommended, setBackupRecommended] = useState<boolean>(false);

  const setLastExportedToNow = () =>
    window.localStorage.setItem("lastExport", `${new Date().toISOString()}`);

  useEffect(() => {
    // Check localStorage for 'lastExport'
    const lastExport = window.localStorage.getItem("lastExport");
    // If doesn't exist, set it to today
    if (!lastExport) {
      setLastExportedToNow();
    }
    // If it does exist, check the date and the difference between today
    if (lastExport) {
      const then = new Date(lastExport).getTime();
      const now = new Date().getTime();

      const diff = Math.abs(now - then);
      const millisecondsInDay = 1000 * 60 * 60 * 24;
      const diffInDays = diff / millisecondsInDay;

      // If diff is > 30 days, show Backup banner
      if (diffInDays > 30) {
        setBackupRecommended(true);
      }
    }
  }, []);

  const outOfStock = data.itemListItems.filter((item) => item.needsMore);
  const inStock = data.itemListItems.filter((item) => !item.needsMore);

  // Transform all of our items into an object of '{category -> items}'
  const categoryList = inStock
    // Filter by location if required
    .filter((item) => (locFilter ? item.location === locFilter : item))
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

  const totalItems = inStock.length;
  const locationFilterObjects = data.locationListItems.map((l) => {
    return {
      title: l.title,
      id: l.id,
      count: inStock.filter((item) => item.location === l.title).length,
    };
  });

  const categoryKeys = Object.keys(categoryList);
  const usedCategoriesInOrder = categoryInfos.filter(
    (cat) => categoryList[cat.name],
  );

  const exportToCsv = () => {
    // Headers for each column
    const headers = ["Title,Amount,Location,Notes,Category,OutOfStock"];

    // Convert items data to a csv
    const itemsCSV = data.itemListItems
      .sort((a, b) => (a.category > b.category ? -1 : 1))
      .sort((a) => (a.needsMore ? 1 : -1))
      .reduce((acc, item) => {
        const { title, amount, location, category, notes, needsMore } = item;
        acc.push(
          [
            title.replace(/,/g, ""),
            amount.replace(/,/g, ""),
            location.replace(/,/g, ""),
            notes ? notes.replace(/,/g, "") : "",
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

    setBackupRecommended(false);
    setLastExportedToNow();
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 pl-2">
        <details>
          <summary
            className="text-black p-2 font-bold relative list-none [&::-webkit-details-marker]:hidden flex items-center gap-1"
            data-menu
          >
            <svg height="32px" viewBox="0 0 32 32" width="32px">
              <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
            </svg>
            <span className="sr-only">Menu</span>
          </summary>
          <nav className="absolute left-0 w-full py-3 mt-1 bg-gray-50 border-bottom shadow-xl z-10">
            <ul className="flex flex-col gap-6 min-h-[50vh] px-2">
              <li className="pt-4">
                <Link to="/locations" className="btn">
                  Freezer Locations
                </Link>
              </li>
              <li>
                <button className="btn" onClick={exportToCsv}>
                  Export items to CSV
                </button>
              </li>
              <li className="mt-auto">
                <Form action="/logout" method="post">
                  <button type="submit" className="btn btn--grey">
                    Logout
                  </button>
                </Form>
              </li>
            </ul>
          </nav>
        </details>

        <Link
          to="new"
          className="rounded-sm text-green-600 border-2 border-current font-bold px-4 py-2 block p-4 text-xl bg-linear-to-bl from-green-100 to-green-50"
        >
          + New Item
        </Link>
      </header>

      <main className="flex flex-col h-full">
        <div className="flex-1 basis-1/5 flex flex-col overflow-auto">
          {outOfStock.length > 0 ? (
            <details className="w-full border-red-700 border-2 bg-red-50 mb-4">
              <summary className="p-2 py-4 list-none [&::-webkit-details-marker]:hidden flex items-center gap-1">
                <svg
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  className="fill-red-400 rotate-180"
                >
                  <path d="M21.171,15.398l-5.912-9.854C14.483,4.251,13.296,3.511,12,3.511s-2.483,0.74-3.259,2.031l-5.912,9.856  c-0.786,1.309-0.872,2.705-0.235,3.83C3.23,20.354,4.472,21,6,21h12c1.528,0,2.77-0.646,3.406-1.771  C22.043,18.104,21.957,16.708,21.171,15.398z M12,17.549c-0.854,0-1.55-0.695-1.55-1.549c0-0.855,0.695-1.551,1.55-1.551  s1.55,0.696,1.55,1.551C13.55,16.854,12.854,17.549,12,17.549z M13.633,10.125c-0.011,0.031-1.401,3.468-1.401,3.468  c-0.038,0.094-0.13,0.156-0.231,0.156s-0.193-0.062-0.231-0.156l-1.391-3.438C10.289,9.922,10.25,9.712,10.25,9.5  c0-0.965,0.785-1.75,1.75-1.75s1.75,0.785,1.75,1.75C13.75,9.712,13.711,9.922,13.633,10.125z" />
                </svg>
                We need to restock...
              </summary>
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

          {locationFilterObjects.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2.5 text-sm my-2 px-2 mb-4">
              <p className="text-xs text-gray-600">Filter by freezer:</p>
              <div className="flex flex-wrap gap-2.5 items-center">
                <div>
                  <button
                    onClick={() => setLocFilter(null)}
                    className={`p-1 px-2 border-2 ${
                      !locFilter
                        ? "border-green-700 outline outline-2 outline-green-700"
                        : "border-gray-400"
                    }`}
                  >
                    <span className="font-mono">All</span> - {totalItems}
                  </button>
                </div>
                {locationFilterObjects.map((location) => (
                  <div key={location.id}>
                    <button
                      onClick={() =>
                        setLocFilter(
                          locFilter === location.title ? null : location.title,
                        )
                      }
                      className={`p-1 px-2 border-2 ${
                        locFilter === location.title
                          ? "border-green-700 outline outline-2 outline-green-400"
                          : "border-gray-400"
                      }`}
                    >
                      <span className="font-mono">{location.title}</span> -{" "}
                      {location.count}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <ol className="flex flex-wrap items-center gap-2.5 px-2">
            <p className="text-xs text-gray-600">Jump to category:</p>
            {usedCategoriesInOrder.map((category) => (
              <Link
                key={category.name}
                to={`#${nameToSlug(category.name)}`}
                className={`text-xs p-2 px-3 rounded-full border bg-opacity-50 ${category.borderColourClass} ${category.bgColourClass}`}
              >
                {category.name} &nbsp;{category.emoji}
              </Link>
            ))}
          </ol>

          {backupRecommended ? (
            <section className="mt-3 p-2">
              <div className="rounded-sm border-yellow-700 ring-2 ring-green-500 border-2 bg-yellow-50 px-3 py-8">
                <p className="mb-4 text-sm">
                  The list of items was backed up more than 30 days ago...{" "}
                  <br /> <strong>Backup to a CSV file now?</strong>
                </p>
                <div className="flex items-center justify-between gap-3">
                  <button
                    className="btn btn--grey"
                    onClick={() => {
                      setBackupRecommended(false);
                      setLastExportedToNow();
                    }}
                  >
                    Dismiss
                  </button>
                  <button
                    className="btn flex-1 text-center"
                    onClick={exportToCsv}
                  >
                    Export backup
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {categoryKeys.length === 0 ? (
            <p className="p-4">
              No items yet. Try adding a freezer location in the menu, then add
              some items.
            </p>
          ) : (
            <ol className="mt-12">
              {usedCategoriesInOrder.map((category) => (
                <li
                  key={category.name}
                  className="-mt-8"
                  id={nameToSlug(category.name)}
                >
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
                        id={item.id}
                        className="last:pb-10 bg-linear-to-tr from-white to-gray-50"
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
          className={`max-h-screen fixed min-h-[60vh] h-auto bottom-0 left-0 w-full border-t-4 border-l-4 empty:translate-y-full translate-y-0 transition-transform flex-1 p-6 rounded-tl-xl overflow-auto shadow-top empty:shadow-none bg-fuchsia-50 border-fuchsia-600 bg-noise`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
