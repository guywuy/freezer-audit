import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "~prisma/client";

import { singleton } from "./singleton.server";
import path from "node:path";

const connectionString = process.env.DATABASE_URL || "file:./data.db";

const rawPath = connectionString.replace(/^file:/, "").split("?")[0];

const absoluteDbPath = path.resolve(process.cwd(), rawPath);

const adapter = new PrismaBetterSqlite3({ url: `file:${absoluteDbPath}` });

const prisma = singleton("prisma", () => new PrismaClient({ adapter }));
prisma.$connect();

export { prisma };
