import { ConvexHttpClient } from "convex/browser"
import { api } from "../convex/_generated/api"
import { staticEvents } from "./static-events"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in environment")
}

const client = new ConvexHttpClient(convexUrl)

async function main() {
  const payload = staticEvents.map((e) => ({
    slug: e.id,
    index: e.index,
    day: e.day,
    date: e.date,
    time: e.time,
    going: e.going,
    title: e.title,
    category: e.category,
    neighborhood: e.neighborhood,
    price: e.price,
    distance: e.distance,
    host: e.host,
    gradient: e.gradient,
    attendees: e.attendees,
    description: e.description,
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

