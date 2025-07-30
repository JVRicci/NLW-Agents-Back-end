import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { and, eq, sql } from 'drizzle-orm'
import { db } from "../../db/connection.ts"
import { schema } from "../../db/schemas/index.ts"
import { z } from "zod/v4"
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts";

/**
 * rota responsável pela criação de questões e inserção no banco
 * @param {string} roomId uuid da sala que a pergunta irá ser registrada
 * @param {string} question Questão criada pelo usuário no front
 * @returns {string} Retorna o id do registro gerado no banco de dados
  */
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

            const embeddings = await generateEmbeddings(question)

            const embeddingsAsString = `[${embeddings.join(',')}]`
            
            // o calculo feito em raw na query serve para calcular a similaridade entre os embeddings
            // Embeddings são vetores com representações numéricas de textos, imagens ou vídeos que capturam as relações entre as entradas
            const chunks = await db
                .select({
                    id : schema.audioChunks.id,
                    transcription : schema.audioChunks.transcription,
                    similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`
                })
                .from(schema.audioChunks)
                .where(
                    and(
                        eq(schema.audioChunks.roomId, roomId),
                        sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
                    )
                )
                .orderBy(sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`)
                .limit(3)
            
            let answer : string | null = null

            if (chunks.length > 0){
                const transcriptions = chunks.map(chunk => chunk.transcription)

                answer = await generateAnswer(question, transcriptions)
            }

            const result = await db
            .insert(schema.questions)
            .values({
                roomId,
                question,
                answer
            })
            .returning()

            if (!result[0]){
                throw new Error("Failed to create a new question")
            }

            return reply.status(201).send({
                questionId: result[0].id,
                answer
            })
        }
    )
}