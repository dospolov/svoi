import { Bookmark, Plus } from "lucide-react"
import { categoryColor, gradientClass } from "@/lib/events"
import { AvatarStack } from "@/components/Avatar"
import { BottomNav } from "@/components/BottomNav"
import Link from "next/link"
import { api, getConvexClient } from "@/lib/convex"

const tabs = ["Near me", "This week", "New", "Most going"] as const;

export default async function FeedPage() {
  const client = getConvexClient()
  const events = await client.query(api.events.listEvents, {})

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background pb-32 text-foreground">
      {/* Header */}
      <header className="px-6 pt-12">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-mono-label text-muted-foreground">SVOI / VOL.18 / WK17</p>
            <h1 className="mt-3 font-serif text-[44px] leading-[1.05] tracking-tight">
              Nothing to do
              <br />
              <span className="text-accent-lime italic">tonight?</span>
            </h1>
          </div>
          <button
            type="button"
            aria-label="Add event"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-lime text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-6 overflow-x-auto pb-1">
          {tabs.map((t, i) => (
            <button
              key={t}
              type="button"
              className={`text-mono-label whitespace-nowrap pb-2 transition-colors ${
                i === 0
                  ? "border-b-2 border-accent-lime text-accent-lime"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Event list */}
      <ul className="mt-2">
        {events.map((event, idx) => (
          <li
            key={event._id}
            className={`px-6 ${idx > 0 ? "border-t border-border/50" : ""}`}
          >
            <Link
              href={`/${event.slug}`}
              className="block py-6 transition-opacity active:opacity-70"
            >
              <div className="flex items-start gap-4">
                <span className="text-mono-label w-6 shrink-0 pt-1 text-muted-foreground">
                  {event.index}
                </span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 text-mono-label">
                    <span className={categoryColor[event.category as keyof typeof categoryColor]}>
                      {event.day}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className={categoryColor[event.category as keyof typeof categoryColor]}>
                      {event.date}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className={categoryColor[event.category as keyof typeof categoryColor]}>
                      {event.time}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className={categoryColor[event.category as keyof typeof categoryColor]}>
                      {String(event.category).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="mt-2 font-sans text-2xl font-bold leading-tight tracking-tight">
                    {event.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.neighborhood}{" "}
                    <span className="text-foreground/30">·</span> {event.host}
                  </p>

                  <div className="mt-4 flex items-center gap-4">
                    <div
                      className={`h-20 w-24 shrink-0 rounded-xl ${gradientClass[event.gradient as keyof typeof gradientClass]}`}
                    />
                    <div className="flex flex-1 flex-col gap-2">
                      <AvatarStack attendees={event.attendees ?? []} />
                      <div className="text-mono-label text-foreground">
                        {event.going}
                      </div>
                      <div className="text-mono-label text-muted-foreground">
                        {event.price} <span className="px-1">·</span> {event.distance}
                      </div>
                    </div>
                  </div>
                </div>
                <Bookmark
                  className={`h-5 w-5 shrink-0 ${
                    idx === 1 ? "fill-accent-lime text-accent-lime" : "text-muted-foreground"
                  }`}
                  strokeWidth={2}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <BottomNav />
    </div>
  )
}

