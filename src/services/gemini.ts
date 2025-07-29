import { GoogleGenAI } from "@google/genai";
import { env } from "../env/index.ts"

const gemini = new GoogleGenAI({
    apiKey: env.GEMINI_APIKEY
})

const model = 'gemini-2.5-flash'

/**
   * Responsável por transcrever o áudio por IA
 */ 
export async  function transcribeAudio(audioAsBase64: string, mimeType: string) {
    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: 'Transcreva o áudio para português do Brasil. Seja preciso e natural na transcrição. Mantenha a pontuação adequada e divida o texto em parágrafos quando for apropriado'
            },
            {
                inlineData: {
                    mimeType,
                    data: audioAsBase64
                }
            }
        ]
    })

    if(!response.text) {
        throw new Error("Não foi possível converter o áudio.")
    }

    return response.text
}

export async function generateEmbeddings(text: string) {
    const response = await gemini.models.embedContent({
        // model: 'text-embedding-804',
        model: 'models/embedding-001',
        contents: [{ text }],
        config: {
            taskType: 'RETRIEVAL_DOCUMENT'
        }
    })

    if(!response.embeddings?.[0].values) {
        throw new Error("Não foi possível gerar os embedding.")
    }

    return response.embeddings[0].values
}