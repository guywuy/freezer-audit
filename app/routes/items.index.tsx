import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/items/")({
  component: ItemIndexPage,
});

function ItemIndexPage() {
  return null;
}
