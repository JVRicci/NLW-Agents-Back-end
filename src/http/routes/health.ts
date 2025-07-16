import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"

export const HealthCheckRoutes : FastifyPluginCallbackZod = (app) => {
    app.get("/health", () => {
        return "OK"
    })
}
