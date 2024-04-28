import type { User, Item } from "@prisma/client";

import { prisma } from "~/db.server";

interface ItemMutation {
  id: string;
  title?: string;
  amount?: string;
  notes?: string;
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
      notes: true,
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
  notes = "",
  location,
  category,
  needsMore,
}: Pick<
  Item,
  "amount" | "title" | "notes" | "location" | "needsMore" | "category"
> & {
  userId: User["id"];
}) {
  return prisma.item.create({
    data: {
      title,
      amount,
      location,
      category,
      notes,
      needsMore,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function cloneItem({
  userId,
  id,
}: {
  id: string;
  userId: User["id"];
}) {
  const toClone = await getItem({ id, userId });

  if (toClone !== null) {
    return createItem({ userId, ...toClone });
  }
  return null;
}

export function updateItem({
  id,
  title,
  amount,
  notes,
  location,
  category,
  needsMore,
}: ItemMutation) {
  return prisma.item.update({
    where: { id },
    data: {
      title,
      amount,
      notes,
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
