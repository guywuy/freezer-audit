import {
  createFileRoute,
  useNavigate,
  Link,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

export const Route = createFileRoute("/join")({
  loader: async ({ context }) => {
    const userId = await getUserId(context.request);
    if (userId) {
      throw redirect({
        to: "/",
      });
    }
    return {};
  },
  component: Join,
});

function Join() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/join" });
  const redirectTo = search.redirectTo ?? undefined;
  const [errors, setErrors] = useState<any>({});
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errors?.username) {
      userNameRef.current?.focus();
    } else if (errors?.password) {
      passwordRef.current?.focus();
    }
  }, [errors]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/join/action", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const to = safeRedirect(redirectTo, "/");
      navigate({ to });
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <form method="post" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="mt-1">
              <input
                ref={userNameRef}
                id="username"
                required
                autoFocus={true}
                name="username"
                autoComplete="username"
                aria-invalid={errors?.username ? true : undefined}
                aria-describedby="username-error"
                className="w-full rounded-sm border border-gray-500 px-2 py-1 text-lg"
              />
              {errors?.username ? (
                <div className="pt-1 text-red-700" id="username-error">
                  {errors.username}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password (min 8 chars)
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded-sm border border-gray-500 px-2 py-1 text-lg"
              />
              {errors?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit" className="w-full btn">
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to="/login"
                search={{ redirectTo }}
              >
                Log in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
