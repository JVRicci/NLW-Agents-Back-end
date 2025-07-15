import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"

import { db } from "../../db/connection.ts"
import { schema } from "../../db/schemas/index.ts"
import { z } from "zod/v4"

export const createRoomRoutes: FastifyPluginCallbackZod = (app) => {
    app.post("/rooms",  {
        schema: {
            body : z.object({
                name: z.string().min(1),
                description: z.string().optional()
            })
        }
    }, 
    async (request, reply ) => {
        const { name, description } = request.body

        const result = await db.insert(schema.rooms).values({
            name,
            description
        }).returning()

        // Verifica se houve registro criado
        if(!result[0]) {
            throw new Error("Failed to create a new room")
        }
        // Caso o registro tenha sido criado, ele retorna o id 
        return reply.status(201).send({ roomId : result[0].id })
    }
    )
}