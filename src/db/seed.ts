import { db, sql } from "./connection.ts"
import { schema } from "./schemas/index.ts"
import { reset, seed } from "drizzle-seed"

await reset(db, schema )


// Gera dados mockados na tabela de rooms
await seed(db, schema ).refine( f => {
    return {
        rooms: {
            count: 5,
            columns: {
                name: f.companyName(),
                description: f.loremIpsum(),
            }
        },
        questions: {
            count: 20
        },
    }
})

await sql.end()

console.log('Database seeded')