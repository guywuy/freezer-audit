import { useMatch } from "@tanstack/react-router";

import type { User } from "~/models/user.server";

function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === "object" &&
    "username" in user &&
    typeof user.username === "string"
  );
}

export function useOptionalUser(): User | undefined {
  const { data } = useMatch({ from: "__root__" });
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}
