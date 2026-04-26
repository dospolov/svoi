import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,
  userProfiles: defineTable({
    userId: v.string(),
    name: v.string(),
    profession: v.optional(v.string()),
    city: v.optional(v.string()),
    age: v.optional(v.string()),
    email: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),
  events: defineTable({
    // Existing `src/lib/events.ts` uses `id` as the route slug (e.g. /sunrise-run-club).
    slug: v.string(),
    index: v.optional(v.string()),
    day: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    going: v.optional(v.string()),
    title: v.string(),
    category: v.string(),
    neighborhood: v.string(),
    host: v.optional(v.string()),
    gradient: v.optional(v.string()),
    attendees: v.optional(
      v.array(
        v.object({
          initials: v.string(),
          color: v.string(),
        }),
      ),
    ),
    // Back-compat for previously seeded rows
    attendeeNames: v.optional(v.array(v.string())),
    price: v.optional(v.string()),
    distance: v.optional(v.string()),
    description: v.optional(v.string()),
    interestIds: v.optional(v.array(v.string())),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_neighborhood", ["neighborhood"]),
})
