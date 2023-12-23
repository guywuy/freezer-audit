import type { User, Item } from "@prisma/client";

import { prisma } from "~/db.server";

interface ItemMutation {
  id: string;
  title?: string;
  amount?: string;
  location?: string;
  category?: string;
  needsMore?: boolean;
}

export function getItem({
  id,
  userId,
}: Pick<Item, "id"> & {
  userId: User["id"];
}) {
  return prisma.item.findFirst({
    select: {
      id: true,
      title: true,
      amount: true,
      location: true,
      category: true,
      needsMore: true,
      createdAt: true,
      updatedAt: true,
    },
    where: { id, userId },
  });
}

export function getItemListItems({ userId }: { userId: User["id"] }) {
  return prisma.item.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      amount: true,
      location: true,
      category: true,
      needsMore: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function createItem({
  userId,
  title,
  amount,
  location,
  category,
  needsMore,
}: Pick<Item, "amount" | "title" | "location" | "needsMore" | "category"> & {
  userId: User["id"];
}) {
  return prisma.item.create({
    data: {
      title,
      amount,
      location,
      category,
      needsMore,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateItem({
  id,
  title,
  amount,
  location,
  category,
  needsMore,
}: ItemMutation) {
  return prisma.item.update({
    where: { id },
    data: {
      title,
      amount,
      location,
      category,
      needsMore,
    },
  });
}

export function deleteItem({
  id,
  userId,
}: Pick<Item, "id"> & { userId: User["id"] }) {
  return prisma.item.deleteMany({
    where: { id, userId },
  });
}

export function markItemNeedsMore({
  id,
  needsMore,
}: Pick<Item, "id" | "needsMore">) {
  return prisma.item.update({
    where: { id },
    data: {
      needsMore,
    },
  });
}
