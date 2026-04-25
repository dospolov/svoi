"use client"

import { Bookmark } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { categoryColor, gradientClass } from "@/lib/events"
import type { Attendee } from "@/lib/events"
import { AvatarStack } from "@/components/Avatar"
import { EventDateFilterToggle } from "@/components/EventDateFilterToggle"
import { EventSearchToggle } from "@/components/EventSearchToggle"

type EventItem = {
  _id: string
  slug: string
  index?: string
  day?: string
  date?: string
  time?: string
  category: string
  title?: string
  neighborhood: string
  host?: string
  description?: string
  attendees?: Attendee[]
  going?: string
  price?: string
  distance?: string
  gradient?: string
}

type FeedEventsSectionProps = {
  events: unknown[]
}

export function FeedEventsSection({ events }: FeedEventsSectionProps) {
  const [query, setQuery] = useState("")
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const typedEvents = events as EventItem[]

  const selectedDateLabels = useMemo(() => {
    return new Set(
      selectedDates.map((date) =>
        date
          .toLocaleDateString("en-US", { month: "short", day: "numeric" })
          .toUpperCase(),
      ),
    )
  }, [selectedDates])

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const hasSearchFilter = normalizedQuery.length >= 2
    const hasDateFilter = selectedDateLabels.size > 0

    if (!hasSearchFilter && !hasDateFilter) {
      return typedEvents
    }

    return typedEvents.filter((event) => {
      const matchesSearch = hasSearchFilter
        ? (event.title ?? "").toLowerCase().includes(normalizedQuery)
        : true
      const matchesDate = hasDateFilter
        ? selectedDateLabels.has((event.date ?? "").toUpperCase())
        : true
      return matchesSearch && matchesDate
    })
  }, [typedEvents, query, selectedDateLabels])

  const isSearchActive = query.trim().length >= 2
  const isDateFilterActive = selectedDateLabels.size > 0
  const hasNoResults = (isSearchActive || isDateFilterActive) && filteredEvents.length === 0

  return (
    <>
      <header className="px-6">
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <EventDateFilterToggle value={selectedDates} onChange={setSelectedDates} />
          <EventSearchToggle value={query} onChange={setQuery} />
        </div>
      </header>

      {hasNoResults ? (
        <div className="mt-3 px-6">
          <div className="rounded-3xl border border-sky-200/55 bg-[linear-gradient(150deg,oklch(1_0_0_/_0.93),oklch(0.972_0.022_238_/_0.78)_50%,oklch(0.942_0.045_215_/_0.6))] px-4 py-5 text-sm text-muted-foreground shadow-[0_26px_54px_-38px_rgba(56,98,141,0.34)] backdrop-blur-xl dark:border-white/12 dark:bg-[linear-gradient(150deg,oklch(0.22_0.02_250_/_0.66),oklch(0.17_0.02_252_/_0.56)_52%,oklch(0.13_0.02_250_/_0.42))]">
            <p className="text-foreground">No events found</p>
            <p className="mt-1">
              Adjust search text or selected dates.
            </p>
          </div>
        </div>
      ) : (
      <ul className="mt-3 space-y-3">
        {filteredEvents.map((event) => (
          <li key={event._id} className="px-6">
            {(() => {
              const hasPreview = !!(
                event.gradient &&
                gradientClass[event.gradient as keyof typeof gradientClass]
              )
              const cardSizeClass = hasPreview ? "min-h-[300px]" : "min-h-[220px]"
              return (
                <Link
                  href={`/${event.slug}`}
                  className={`relative block overflow-hidden rounded-3xl border border-sky-200/55 bg-[linear-gradient(150deg,oklch(1_0_0_/_0.93),oklch(0.972_0.022_238_/_0.78)_50%,oklch(0.942_0.045_215_/_0.6))] px-4 py-6 shadow-[0_26px_54px_-38px_rgba(56,98,141,0.34)] backdrop-blur-xl transition-all hover:border-sky-300/70 hover:shadow-[0_32px_58px_-38px_rgba(56,98,141,0.4)] active:opacity-70 dark:border-white/12 dark:bg-[linear-gradient(150deg,oklch(0.22_0.02_250_/_0.66),oklch(0.17_0.02_252_/_0.56)_52%,oklch(0.13_0.02_250_/_0.42))] ${cardSizeClass}`}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/40 to-transparent dark:from-white/15"
                  />
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="flex w-6 shrink-0 justify-center text-mono-label text-muted-foreground">
                        {event.index ?? ""}
                      </span>
                      <div className="flex min-h-9 min-w-0 flex-1 items-center">
                        <div className="flex flex-wrap items-baseline gap-2 text-mono-label">
                          <span className={categoryColor[event.category as keyof typeof categoryColor]}>
                            {event.day ?? ""}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className={categoryColor[event.category as keyof typeof categoryColor]}>
                            {event.date ?? ""}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className={categoryColor[event.category as keyof typeof categoryColor]}>
                            {event.time ?? ""}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className={categoryColor[event.category as keyof typeof categoryColor]}>
                            {String(event.category).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-input/60 bg-background/40 text-muted-foreground backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                        <Bookmark
                          className={`h-5 w-5 ${
                            event.slug === "home-party"
                              ? "fill-accent-lime text-accent-lime"
                              : "text-muted-foreground"
                          }`}
                          strokeWidth={2}
                        />
                      </span>
                    </div>
                    <div className="mt-2 pl-10">
                      <h2 className="line-clamp-2 font-sans text-2xl font-bold leading-tight tracking-tight">
                        {event.title ?? ""}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.neighborhood}{" "}
                        <span className="text-foreground/30">·</span> {event.host ?? ""}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/75">
                        {event.description ?? ""}
                      </p>

                      <div className={`mt-4 flex items-center gap-4 ${hasPreview ? "" : "pt-2"}`}>
                        {hasPreview ? (
                          <div
                            className={`h-20 w-24 shrink-0 rounded-xl ${gradientClass[event.gradient as keyof typeof gradientClass]}`}
                          />
                        ) : null}
                        <div className="flex flex-1 flex-col gap-2">
                          <AvatarStack attendees={event.attendees ?? []} />
                          <div className="text-mono-label text-foreground">{event.going ?? ""}</div>
                          <div className="text-mono-label text-muted-foreground">
                            {event.price ?? ""} <span className="px-1">·</span> {event.distance ?? ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })()}
          </li>
        ))}
      </ul>
      )}
    </>
  )
}
