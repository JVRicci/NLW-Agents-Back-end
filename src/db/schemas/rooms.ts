import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core"

export const rooms = pgTable("rooms", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    description: text(),
    createdAt: timestamp().defaultNow().notNull()
})