// Arquivo para configuração da ORM utilizada no projeto
import { defineConfig } from "drizzle-kit"
import { env } from "./src/env/index.ts"

export default defineConfig({
    dialect: "postgresql",
    casing: "snake_case",
    schema: "./src/db/schemas/**.ts",
    out: "./src/db/migrations",
    dbCredentials: {
        url: env.DATABASE_URL,
    }
})