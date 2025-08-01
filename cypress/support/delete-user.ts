// Use this to delete a user by their username
// Simply call this with:
// npx ts-node -r tsconfig-paths/register ./cypress/support/delete-user.ts testlorem,
// and that user will get deleted

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { prisma } from "../../app/db.server";

async function deleteUser(username: string) {
  if (!username) {
    throw new Error("username required for login");
  }

  try {
    await prisma.user.delete({ where: { username } });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log("User not found, so no need to delete");
    } else {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser(process.argv[2]);
