import { GoogleGenAI } from "@google/genai";
import { env } from "../env/index.ts"

const gemini = new GoogleGenAI({
    apiKey: env.GEMINI_APIKEY
})

const model = 'gemini-2.5-flash'

/**
 * Responsável por transcrever o áudio por IA
 * @param audioAsBase64 conversão do audio em base64
 * @param mimeType Formato do audio,
 * @returns Conversão do audio em texto
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

/**
 * Responsvável por criar embeddings (vetores com representações numéricas de textos, imagens ou vídeos que capturam as relações entre as entradas)
 * @param text texto do audio
 * @returns Vetor de embeddings
 */
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

/**
 * Gera respostas para as questões 
 * @param question 
 * @param transcriptions 
 */
export async function generateAnswer(question: string, transcriptions: string[]){
    const context = transcriptions.join('\n\n')
    const prompt = `
        Com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e precisa em português do Brasil

        CONTEXTO:
        ${context}

        PERGUNTA:
        ${question}

        INSTRUÇÕES:
        - Use apenas informações no contexto enviado;
        - Se a resposta não for encontrada no contexto, apenas responda que não possui informações suficientes para responder;
        - Seja objetivo;
        - Mantenha um tom educativo e profissional;
        - Cite trechos relevantes do contexto se apropriado;
        - Se for citar o contexto, utilize o termo conteúdo da aula";
    
    `.trim()

    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: prompt
            }
        ]
    })

    if (!response.text) {
        throw new Error ("Falha ao gerar resposta pelo Gemini")
    }

    return response.text
}