import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schemas/index.ts"

export const getRoomsRoute : FastifyPluginCallbackZod  = async (app) => {
    app.get("/rooms", async () =>{
        const results = await db
            .select({
                id: schema.rooms.id,
                name: schema.rooms.name
            })
            .from(schema.rooms)
            .orderBy(schema.rooms.createdAt)
        return results
    })
}