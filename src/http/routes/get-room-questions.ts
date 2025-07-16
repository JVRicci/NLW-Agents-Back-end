import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";

import { desc, eq } from "drizzle-orm";
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schemas/index.ts"
import { z } from "zod/v4"

export const getRoomQuestionRoute : FastifyPluginCallbackZod = (app) => {
    app.get("/rooms/:roomId/questions", {
        schema: {
            params: z.object({
                roomId: z.string()
            })
        }
    },
    async (request) =>{
        const { roomId } = request.params

        const result = await db
            .select({
                id: schema.questions.id,
                question: schema.questions.question,
                answer: schema.questions.answer,
                createdAt: schema.questions.createdAt
            })
            .from(schema.questions)
            .where(eq(schema.questions.roomId, roomId))
            .orderBy(desc(schema.questions.createdAt))

        return result
    }) 
}