import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    database: "postgresql://devuser:devpassword@localhost:5432/prospecting",
  },
});
