import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

export const Route = createFileRoute("/login")({
  loader: async ({ context }) => {
    const userId = await getUserId(context.request);
    if (userId) {
      throw redirect({
        to: "/",
      });
    }
    return {};
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const redirectTo = search.redirectTo || "/items";
  const [errors, setErrors] = useState<any>({});
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errors?.username) {
      usernameRef.current?.focus();
    } else if (errors?.password) {
      passwordRef.current?.focus();
    }
  }, [errors]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/login/action", {
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
                ref={usernameRef}
                id="username"
                required
                autoFocus={true}
                name="username"
                placeholder="d***w****"
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
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="c******c****"
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
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
