import { reset, seed } from "drizzle-seed"
import { db, sql } from "./connection.ts"
import { schema } from "./schemas/index.ts"

await reset(db, schema )


// Gera dados mockados na tabela de rooms
await seed(db, schema ).refine( f => {
    return {
        rooms: {
            count: 20,
            columns: {
                name: f.companyName(),
                description: f.loremIpsum()
            }
        }
    }
})

await sql.end()
// biome-ignore lint/suspicious/noConsole: only use in dev
console.log('Database seeded')