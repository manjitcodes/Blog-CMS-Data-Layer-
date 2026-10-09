
import "dotenv/config";
import { defineConfig } from "prisma/config";
import process from "process";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    ...(process.env.DATABASE_URL !== undefined
      ? { url: process.env.DATABASE_URL }
      : {}),
  },
});
