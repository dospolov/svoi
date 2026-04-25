import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  events: defineTable({
    // Existing `src/lib/events.ts` uses `id` as the route slug (e.g. /sunrise-run-club).
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    neighborhood: v.string(),
    day: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    price: v.optional(v.string()),
    distance: v.optional(v.string()),
    host: v.optional(v.string()),
    gradient: v.optional(v.string()),
    attendeeNames: v.optional(v.array(v.string())),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_neighborhood", ["neighborhood"]),
})
