import { config } from "dotenv"
import { z } from "zod"

const envSchema= z.object({
    NODE_ENV: z.enum(["develop"])
        .default("develop"),
    PORT : z.coerce.number().default(3333)
})

export const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    throw new Error(`Invalid enviroment variables\n${_env.error.format()}`,)
}

export const env = _env.data