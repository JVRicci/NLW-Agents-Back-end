import { fastify } from "fastify"
import { fastifyMultipart } from "@fastify/multipart"
import { sql } from './db/connection.ts'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from "fastify-type-provider-zod"
import { fastifyCors } from "@fastify/cors"
import { env } from "./env/index.ts"
import { getRoomsRoutes } from "./http/routes/get-rooms.ts"
import { createRoomRoutes } from "./http/routes/create-room.ts"
import { getRoomQuestionRoute } from "./http/routes/get-room-questions.ts"
import { createQuestionRoute } from "./http/routes/create-question.ts"
import { HealthCheckRoutes } from "./http/routes/health.ts"
import { uploadAudioRoute } from "./http/routes/upload-audio.ts"


const app = fastify()
    .withTypeProvider<ZodTypeProvider>()
    
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
    
app.register(fastifyCors, {
    origin: "http://localhost:5173"
})

// Responsavel por fazer a api a compreender multipart de requisições
// como por exemplo as requests de upload de áudio
app.register(fastifyMultipart)

app.register(HealthCheckRoutes)
app.register(getRoomsRoutes)
app.register(createRoomRoutes)
app.register(getRoomQuestionRoute)
app.register(createQuestionRoute)
app.register(uploadAudioRoute)

app.addHook("preHandler", async (request, reply) =>{
    console.log(`[${request.method} - ${request.url}]`)
})

app.listen({ port: env.PORT }).then(() => {
    console.log(`Server is running on port ${ env.PORT }`)
}) 