import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Freezer audit" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white grid place-items-center">
      {/* <Link
        to="/join"
        className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-xs hover:bg-yellow-50 sm:px-8"
      >
        Sign up
      </Link> */}
      {user ? (
        <Link
          to="/items"
          className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
        >
          View Frozen Items for {user.username}
        </Link>
      ) : (
        <Link
          to="/login"
          className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
        >
          Log In
        </Link>
      )}
    </main>
  );
}
