import { config } from 'dotenv'
import { z } from 'zod'

// Caso for executado server em ambiente de testes, ele irá utilizar .env.test
if(process.env.NODE_ENV == 'test'){
    config({ path: '.env.test'})
} else {
    config()
}

const envSchema= z.object({
    NODE_ENV: z.enum(["develop"])
        .default("develop"),
    DATABASE_URL: z.string().url().startsWith('postgresql://'),
    PORT : z.coerce.number().default(3333),
    GEMINI_APIKEY : z.string()
})

export const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    throw new Error(`Invalid enviroment variables\n${_env.error}`,)
}

export const env = _env.data