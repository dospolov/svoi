import type { Doc, Id } from "./_generated/dataModel"
import { internalMutation } from "./_generated/server"

async function userDocByProfileUserId(
  ctx: { db: { get: (id: Id<"users">) => Promise<Doc<"users"> | null> } },
  profileUserId: string,
): Promise<Doc<"users"> | null> {
  try {
    return await ctx.db.get(profileUserId as Id<"users">)
  } catch {
    return null
  }
}

/**
 * One-shot: rewrite legacy `userProfiles.userId` values that were stored as
 * `identity.subject` to the canonical Convex Auth `users` row id (match by profile email).
 *
 * Run once per deployment (dev/staging/prod as needed):
 *   pnpm exec convex run migrations:migrateUserProfileUserIds
 *   pnpm exec convex run migrations:migrateUserProfileUserIds --prod
 *
 * Then you can rely on `getAuthUserId`-only lookups in `users.ts`.
 */
export const migrateUserProfileUserIds = internalMutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("userProfiles").collect()
    let patched = 0
    let alreadyCanonical = 0
    let skippedNoEmail = 0
    let skippedNoMatchingUser = 0

    for (const p of profiles) {
      const userById = await userDocByProfileUserId(ctx, p.userId)
      if (userById !== null && userById._id === p.userId) {
        alreadyCanonical++
        continue
      }

      const email = p.email?.trim()
      if (!email) {
        skippedNoEmail++
        continue
      }

      const matches = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", email))
        .collect()

      const user = matches[0]
      if (!user) {
        skippedNoMatchingUser++
        continue
      }

      await ctx.db.patch(p._id, { userId: user._id })
      patched++
    }

    const after = await ctx.db.query("userProfiles").collect()
    const byUserId = new Map<string, Doc<"userProfiles">[]>()
    for (const row of after) {
      const list = byUserId.get(row.userId) ?? []
      list.push(row)
      byUserId.set(row.userId, list)
    }

    let deletedDuplicates = 0
    for (const group of byUserId.values()) {
      if (group.length <= 1) {
        continue
      }
      group.sort((a, b) => b._creationTime - a._creationTime)
      const [, ...rest] = group
      for (const dup of rest) {
        await ctx.db.delete(dup._id)
        deletedDuplicates++
      }
    }

    return {
      totalProfiles: profiles.length,
      patched,
      alreadyCanonical,
      skippedNoEmail,
      skippedNoMatchingUser,
      deletedDuplicates,
    }
  },
})
