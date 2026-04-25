import { Bookmark, Plus } from "lucide-react"
import { categoryColor, gradientClass } from "@/lib/events"
import { AvatarStack } from "@/components/Avatar"
import { BottomNav } from "@/components/BottomNav"
import Link from "next/link"
import { api, getConvexClient } from "@/lib/convex"
import { Button } from "@/components/ui/button"

const tabs = ["Near me", "This week", "New", "Most going"] as const;

export default async function FeedPage() {
  const client = getConvexClient()
  const events = await client.query(api.events.listEvents, {})

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background pb-32 text-foreground">
      {/* Header */}
      <header className="px-6 pt-12">
        <div className="relative overflow-hidden rounded-3xl border border-sky-200/60 bg-[linear-gradient(145deg,oklch(1_0_0_/_0.94),oklch(0.975_0.028_235_/_0.82)_52%,oklch(0.94_0.055_210_/_0.62))] p-4 shadow-[0_26px_58px_-36px_rgba(56,98,141,0.35)] backdrop-blur-xl dark:border-white/12 dark:bg-[linear-gradient(145deg,oklch(0.2_0.02_250_/_0.65),oklch(0.16_0.02_250_/_0.52)_55%,oklch(0.13_0.01_250_/_0.38))]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/45 via-white/15 to-transparent dark:from-white/20 dark:via-white/5"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-white/25 blur-3xl dark:bg-white/8"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -bottom-16 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl dark:bg-sky-400/10"
          />
          <div className="relative flex items-start justify-between">
          <div>
            <p className="text-mono-label text-muted-foreground">SVOI / VOL.18 / WK17</p>
            <h1 className="mt-3 font-serif text-[44px] leading-[1.05] tracking-tight">
              Nothing to do
              <br />
              <span className="text-accent-lime italic">tonight?</span>
            </h1>
          </div>
          <Button
            type="button"
            aria-label="Add event"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-lime text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-6 overflow-x-auto pb-1">
          {tabs.map((t, i) => (
            <Button
              key={t}
              type="button"
              variant="ghost"
              className={`text-mono-label whitespace-nowrap pb-2 transition-colors ${
                i === 0
                  ? "border-b-2 border-accent-lime text-accent-lime"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </Button>
          ))}
        </div>
      </header>

      {/* Event list */}
      <ul className="mt-3 space-y-3">
        {events.map((event) => (
          <li key={event._id} className="px-6">
            {(() => {
              const hasPreview = !!(
                event.gradient &&
                gradientClass[event.gradient as keyof typeof gradientClass]
              )
              const cardSizeClass = hasPreview
                ? "min-h-[300px]"
                : "min-h-[220px]"
              return (
            <Link
              href={`/${event.slug}`}
              className={`relative block overflow-hidden rounded-3xl border border-sky-200/55 bg-[linear-gradient(150deg,oklch(1_0_0_/_0.93),oklch(0.972_0.022_238_/_0.78)_50%,oklch(0.942_0.045_215_/_0.6))] px-4 py-6 shadow-[0_26px_54px_-38px_rgba(56,98,141,0.34)] backdrop-blur-xl transition-all hover:border-sky-300/70 hover:shadow-[0_32px_58px_-38px_rgba(56,98,141,0.4)] active:opacity-70 dark:border-white/12 dark:bg-[linear-gradient(150deg,oklch(0.22_0.02_250_/_0.66),oklch(0.17_0.02_252_/_0.56)_52%,oklch(0.13_0.02_250_/_0.42))] ${cardSizeClass}`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/40 to-transparent dark:from-white/15"
              />
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
                  <h2 className="mt-2 line-clamp-2 font-sans text-2xl font-bold leading-tight tracking-tight">
                    {event.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.neighborhood}{" "}
                    <span className="text-foreground/30">·</span> {event.host}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/75">
                    {event.description}
                  </p>

                  <div className={`mt-4 flex items-center gap-4 ${hasPreview ? "" : "pt-2"}`}>
                    {hasPreview ? (
                      <div
                        className={`h-20 w-24 shrink-0 rounded-xl ${gradientClass[event.gradient as keyof typeof gradientClass]}`}
                      />
                    ) : null}
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
                    event.slug === "home-party"
                      ? "fill-accent-lime text-accent-lime"
                      : "text-muted-foreground"
                  }`}
                  strokeWidth={2}
                />
              </div>
            </Link>
              )
            })()}
          </li>
        ))}
      </ul>

      <BottomNav />
    </div>
  )
}

