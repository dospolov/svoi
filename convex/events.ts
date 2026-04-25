import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const listEvents = query({
  args: {
    category: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50

    if (args.category) {
      return await ctx.db
        .query("events")
        .withIndex("by_category", (q) =>
          q.eq("category", args.category as string),
        )
        .take(limit)
    }

    if (args.neighborhood) {
      return await ctx.db
        .query("events")
        .withIndex("by_neighborhood", (q) =>
          q.eq("neighborhood", args.neighborhood as string),
        )
        .take(limit)
    }

    return await ctx.db.query("events").order("desc").take(limit)
  },
})

export const getEventBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique()
  },
})

export const getEvent = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createEvent = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("events", args)
    return id
  },
})

export const seedFromStaticEvents = mutation({
  args: {
    events: v.array(
      v.object({
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
      }),
    ),
  },
  handler: async (ctx, args) => {
    let inserted = 0
    let skipped = 0

    for (const event of args.events) {
      const existing = await ctx.db
        .query("events")
        .withIndex("by_slug", (q) => q.eq("slug", event.slug))
        .unique()

      if (existing) {
        skipped += 1
        continue
      }

      await ctx.db.insert("events", event)
      inserted += 1
    }

    return { inserted, skipped }
  },
})
