import { renderToReadableStream } from "react-dom/server";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function render(url: string) {
  const router = createRouter({
    routeTree,
  });

  const stream = renderToReadableStream(
      <RouterProvider router={router} />
  );

  return stream;
}
