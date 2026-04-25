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
      profession: profile?.profession ?? "",
      city: profile?.city ?? "",
      age: profile?.age ?? "",
      email: profile?.email ?? identity.email ?? "",
      password: profile?.password ?? "",
    }
  },
})

export const upsertMyName = mutation({
  args: {
    name: v.string(),
    profession: v.optional(v.string()),
    city: v.optional(v.string()),
    age: v.optional(v.string()),
    email: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    const nextName = args.name.trim()
    const nextProfession = args.profession?.trim() ?? ""
    const nextCity = args.city?.trim() ?? ""
    const nextAge = args.age?.trim() ?? ""
    const nextEmail = args.email?.trim() ?? identity.email ?? ""
    const nextPassword = args.password?.trim()
    if (!nextName) {
      throw new Error("Name is required")
    }
    if (!nextEmail) {
      throw new Error("Email is required")
    }

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique()

    if (existing) {
      const patchData: {
        name: string
        profession: string
        city: string
        age: string
        email: string
        password?: string
      } = {
        name: nextName,
        profession: nextProfession,
        city: nextCity,
        age: nextAge,
        email: nextEmail,
      }
      if (nextPassword) {
        patchData.password = nextPassword
      }
      await ctx.db.patch(existing._id, patchData)
      return existing._id
    }

    const newProfile: {
      userId: string
      name: string
      profession: string
      city: string
      age: string
      email: string
      password?: string
    } = {
      userId: identity.subject,
      name: nextName,
      profession: nextProfession,
      city: nextCity,
      age: nextAge,
      email: nextEmail,
    }
    if (nextPassword) {
      newProfile.password = nextPassword
    }

    return await ctx.db.insert("userProfiles", newProfile)
  },
})

