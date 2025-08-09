import { createFileRoute, Link } from "@tanstack/react-router";

import { useOptionalUser } from "~/use-auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white grid place-items-center">
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
