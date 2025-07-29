import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";

import { db } from "../../db/connection.ts"
import { schema } from "../../db/schemas/index.ts"
import { z } from "zod/v4"
import { generateEmbeddings, transcribeAudio } from "../../services/gemini.ts";

/** Rota responsável por fazer a executar a transcrição de audio e registrar em banco o resulttado
 * @param {string} roomId ID da sala que está atribuida a pergunta
 * @returns {string} ID do registro salvo
 * @throws  Audio is required
 */
export const uploadAudioRoute : FastifyPluginCallbackZod = (app) => {
    app.post(
        "/rooms/:roomId/audio",{
            schema: {
                params: z.object({
                    roomId: z.string()
                }),
            } 
        },
        async (request, reply) => {
            const { roomId } = request.params
            const audio = await request.file()

            if (!audio) {
                throw new Error('Audio is required')
            }

            // Acumula em memória todo o tamanho do arquivo de áudio para transforma-lo em uma string base64
            const audioBuffer = await audio.toBuffer()
            const audioAsBase64 = audioBuffer.toString('base64')

            const transcription = await transcribeAudio( 
                audioAsBase64, 
                audio.mimetype
            )

            const embeddings = await generateEmbeddings(
                transcription
            )

            const result = await db.insert(schema.audioChunks).values({
                roomId,
                transcription,
                embeddings
            }).returning()

            const chunk = result[0]

            return reply.status(201).send({ chunkId: chunk.id })
            
        }
    )
}