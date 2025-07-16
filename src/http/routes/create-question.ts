import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";

import { db } from "../../db/connection.ts"
import { schema } from "../../db/schemas/index.ts"
import { z } from "zod/v4"

export const createQuestionRoute : FastifyPluginCallbackZod = (app) => {
    app.post(
        "/rooms/:roomId/questions",{
            schema: {
                params: z.object({
                    roomId: z.string()
                }),
                body: z.object({
                    question: z.string().min(1)
                })
            }
        },
        async (request, reply) => {
            const { roomId } = request.params
            const { question } = request.body

            const result = await db
            .insert(schema.questions)
            .values({
                roomId,
                question
            })
            .returning()

            if (!result[0]){
                throw new Error("Failed to create a new question")
            }

            return reply.status(201).send({ questionId: result[0].id })
        }
    )
}