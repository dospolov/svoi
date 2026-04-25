import { ConvexHttpClient } from "convex/browser"
import { api } from "../convex/_generated/api"
import { events } from "../src/lib/events"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in environment")
}

const client = new ConvexHttpClient(convexUrl)

async function main() {
  const payload = events.map((e) => ({
    slug: e.id,
    title: e.title,
    description: e.description,
    category: e.category,
    neighborhood: e.neighborhood,
    day: e.day,
    date: e.date,
    time: e.time,
    price: e.price,
    distance: e.distance,
    host: e.host,
    gradient: e.gradient,
    attendeeNames: e.attendees.map((a) => a.initials),
  }))

  const result = await client.mutation(api.events.seedFromStaticEvents, {
    events: payload,
  })

  // biome-ignore lint/suspicious/noConsole: seed script output
  console.log(
    `Seeded events into Convex. Inserted=${result.inserted}, skipped=${result.skipped}`,
  )
}

main().catch((err) => {
  // biome-ignore lint/suspicious/noConsole: seed script output
  console.error(err)
  process.exitCode = 1
})

