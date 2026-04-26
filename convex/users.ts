import {
  getAuthUserId,
  modifyAccountCredentials,
  retrieveAccount,
} from "@convex-dev/auth/server"
import { internal } from "./_generated/api"
import { action, internalQuery, mutation, query } from "./_generated/server"
import { v } from "convex/values"

const PASSWORD_PROVIDER_ID = "password"

/** Login email for the password provider (not the profile email field). */
export const getAuthAccountEmail = internalQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }
    const user = await ctx.db.get(userId)
    return user?.email ?? null
  },
})

/**
 * Updates the Convex Auth password credential (hashed server-side).
 * Auth is propagated to `runQuery` per Convex actions semantics.
 */
export const changeMyPassword = action({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    const accountEmail = await ctx.runQuery(
      internal.users.getAuthAccountEmail,
      {},
    )
    if (!accountEmail) {
      throw new Error("Missing account email")
    }

    const current = args.currentPassword.trim()
    const next = args.newPassword.trim()
    if (!current || !next) {
      throw new Error("Password is required")
    }
    if (next.length < 8) {
      throw new Error("Password must be at least 8 characters")
    }

    let retrieved: unknown
    try {
      retrieved = await retrieveAccount(ctx, {
        provider: PASSWORD_PROVIDER_ID,
        account: { id: accountEmail, secret: current },
      })
    } catch {
      throw new Error("Invalid current password")
    }
    if (retrieved === null) {
      throw new Error("Invalid current password")
    }

    await modifyAccountCredentials(ctx, {
      provider: PASSWORD_PROVIDER_ID,
      account: { id: accountEmail, secret: next },
    })
  },
})

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return null
    }

    const authUserId = await getAuthUserId(ctx)
    const authUser = authUserId !== null ? await ctx.db.get(authUserId) : null

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique()

    const name =
      profile?.name ?? authUser?.name ?? identity.name ?? ""
    const email =
      profile?.email ?? authUser?.email ?? identity.email ?? ""

    return {
      ...identity,
      name,
      profession: profile?.profession ?? "",
      city: profile?.city ?? "",
      age: profile?.age ?? "",
      email,
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
      } = {
        name: nextName,
        profession: nextProfession,
        city: nextCity,
        age: nextAge,
        email: nextEmail,
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
    } = {
      userId: identity.subject,
      name: nextName,
      profession: nextProfession,
      city: nextCity,
      age: nextAge,
      email: nextEmail,
    }

    return await ctx.db.insert("userProfiles", newProfile)
  },
})

