import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique()

    return {
      ...identity,
      name: profile?.name ?? identity.name,
    }
  },
})

export const upsertMyName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    const nextName = args.name.trim()
    if (!nextName) {
      throw new Error("Name is required")
    }

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, { name: nextName })
      return existing._id
    }

    return await ctx.db.insert("userProfiles", {
      userId: identity.subject,
      name: nextName,
    })
  },
})

