import { fastify } from "fastify"
import { sql } from './db/connection.ts'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from "fastify-type-provider-zod"
import { fastifyCors } from "@fastify/cors"
import { env } from "./env/index.ts"
import { getRoomsRoute } from "./http/routes/get-rooms.ts"


const app = fastify()
    .withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
    origin: "http://localhost:5173"
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get("/health", () => {
    return "Hello World"
})

app.register(getRoomsRoute)

app.listen({ port: env.PORT }).then(() => {
    console.log(`Server is running on port ${ env.PORT }`)
}) 