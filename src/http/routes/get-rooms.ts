import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"

import { db } from "../../db/connection.ts"
import { schema } from "../../db/schemas/index.ts"
import { questions } from "../../db/schemas/questions.ts"
import { count, eq } from "drizzle-orm"

export const getRoomsRoutes : FastifyPluginCallbackZod  = async (app) => {
    app.get("/rooms", async () =>{
        const results = await db
            .select({
                id: schema.rooms.id,
                name: schema.rooms.name,
                questionsCount: count(questions.id),
                createdAt : schema.rooms.createdAt

            })
            .from(schema.rooms)
            .leftJoin(schema.questions, eq(schema.questions.roomId, schema.rooms.id))
            .groupBy(schema.rooms.id)
            .orderBy(schema.rooms.createdAt)
        return results
    })
}