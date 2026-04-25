import { notFound } from "next/navigation"
import Link from "next/link"
import { Bookmark, ChevronLeft, MapPin, Search } from "lucide-react"
import { categoryColor, gradientClass } from "@/lib/events"
import { AvatarStack } from "@/components/Avatar"
import { BottomNav } from "@/components/BottomNav"
import { ThemeToggle } from "@/components/theme-toggle"
import { api, getConvexClient } from "@/lib/convex"
import { Button } from "@/components/ui/button"

type PageProps = {
  params: Promise<{
    id: string
  }>
}


const chips = ["All", "Active", "Craft", "Food & drink", "Music"] as const;

export default async function EventPage({ params }: PageProps) {
  const { id } = await params
  const client = getConvexClient()
  const event = await client.query(api.events.getEventBySlug, { slug: id })
  if (!event) {
    notFound()
  }

  const more = (await client.query(api.events.listEvents, { limit: 10 }))
    .filter((e) => e.slug !== id)
    .slice(0, 3)

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background pb-32 text-foreground">
      {/* Header */}
      <header className="px-6 pt-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-surface-1"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="font-serif text-4xl italic leading-none">Svoi</h1>
          <div className="flex items-center gap-1.5">
            <ThemeToggle className="h-9 w-9 rounded-xl border-border/70 bg-surface-1 shadow-none" />
            <Button
              type="button"
              aria-label="Search"
              variant="ghost"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-1 text-foreground/80"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-mono-label mt-3 text-muted-foreground">
          {event.neighborhood.toUpperCase()} · THIS WEEK
        </p>

        {/* Chips */}
        <div className="-mx-6 mt-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chips.map((c, i) => (
            <Button
              key={c}
              type="button"
              variant="ghost"
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                i === 0
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/70 bg-transparent text-foreground/80 hover:bg-surface-1"
              }`}
            >
              {c}
            </Button>
          ))}
        </div>
      </header>

      {/* Featured card */}
      <section className="mt-6 px-6">
        <div
          className={`relative overflow-hidden rounded-3xl ${gradientClass[event.gradient as keyof typeof gradientClass]} aspect-[4/5]`}
        >
          {/* Top row: badge + bookmark */}
          <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
            <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-accent-lime shadow-[0_0_8px_var(--accent-lime)]" />
              <span className="text-xs font-medium text-foreground">
                Featured · {String(event.category)[0]?.toUpperCase()}
                {String(event.category).slice(1)}
              </span>
            </div>
            <Button
              type="button"
              aria-label="Save"
              variant="ghost"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-foreground backdrop-blur-md"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>

          {/* Bottom info */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="text-mono-label text-accent-lime">
              {event.day} · {event.date} · {event.time}
            </div>
            <h2 className="mt-2 font-sans text-3xl font-bold leading-tight tracking-tight text-white drop-shadow">
              {event.title}
            </h2>
            <div className="mt-4 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <AvatarStack attendees={event.attendees ?? []} size={28} />
                <span className="text-sm text-white/90">
                  {String(event.going).split("/")[0]} going
                </span>
              </div>
              <div className="text-right text-sm text-white/80">
                <MapPin className="mr-1 inline h-3.5 w-3.5" />
                {event.neighborhood} · {String(event.distance).toLowerCase()}
              </div>
            </div>
            <p className="text-mono-label mt-3 text-white/60">
              {String(event.host).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Description + CTA */}
        <p className="mt-6 text-base leading-relaxed text-foreground/80">
          {event.description}
        </p>
        <div className="mt-5 flex gap-3">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 rounded-full bg-accent-lime py-4 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Join — {event.price}
          </Button>
          <Button
            type="button"
            aria-label="Save"
            variant="outline"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-1 text-foreground"
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* More this week */}
      <section className="mt-10 px-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-mono-label text-muted-foreground">MORE THIS WEEK</h3>
          <span className="text-mono-label text-muted-foreground">{more.length} events</span>
        </div>

        <ul className="mt-4 space-y-3">
          {more.map((e) => (
            <li key={e._id}>
              <Link
                href={`/${e.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-surface-1 p-3 transition-colors hover:bg-surface-2"
              >
                <div
                  className={`flex h-20 w-20 shrink-0 items-end rounded-xl p-2 ${gradientClass[e.gradient as keyof typeof gradientClass]}`}
                >
                  <span className="rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                    {String(e.day)[0] + String(e.day).slice(1, 3).toLowerCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-mono-label ${categoryColor[e.category as keyof typeof categoryColor]}`}
                  >
                    · {String(e.category).toUpperCase()}
                  </div>
                  <p className="mt-1 truncate font-sans text-base font-semibold leading-tight">
                    {e.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {e.neighborhood}
                  </p>
                </div>
                <AvatarStack attendees={(e.attendees ?? []).slice(0, 3)} size={22} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <BottomNav />
    </div>
  )
}