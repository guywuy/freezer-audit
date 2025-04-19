import type { User, Location } from "@prisma/client";

import { prisma } from "~/db.server";

interface LocationMutation {
  id: string;
  title?: string;
}

export function getLocation({
  id,
  userId,
}: Pick<Location, "id"> & {
  userId: User["id"];
}) {
  return prisma.location.findFirst({
    select: {
      id: true,
      title: true,
    },
    where: { id, userId },
  });
}

export function getLocationListItems({ userId }: { userId: User["id"] }) {
  return prisma.location.findMany({
    where: { userId },
    select: {
      title: true,
      id: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function createLocation({
  userId,
  title,
}: Pick<Location, "title"> & {
  userId: User["id"];
}) {
  return prisma.location.create({
    data: {
      title,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateLocation({ id, title }: LocationMutation) {
  return prisma.location.update({
    where: { id },
    data: {
      title,
    },
  });
}

export function deleteLocation({
  id,
  userId,
}: Pick<Location, "id"> & { userId: User["id"] }) {
  return prisma.location.deleteMany({
    where: { id, userId },
  });
}
