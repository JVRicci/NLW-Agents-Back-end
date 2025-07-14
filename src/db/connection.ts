import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { env } from "../env/index.ts"
import { schema } from "./schemas/index.ts"

export const sql = postgres(env.DATABASE_URL)
export const db = drizzle(sql, {
    schema, 
    // Faz com que o padrão de nomes da tabela seja snake_case
    casing: 'snake_case'
})

// Query test
// const result = await sql`SELECT 'Hello' as message`
