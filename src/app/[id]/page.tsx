import { notFound } from "next/navigation"
import Link from "next/link"
import { Bookmark, ChevronLeft, MapPin } from "lucide-react"
import { gradientClass } from "@/lib/events"
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

export default async function EventPage({ params }: PageProps) {
  const { id } = await params
  const client = getConvexClient()
  const event = await client.query(api.events.getEventBySlug, { slug: id })
  if (!event) {
    notFound()
  }

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
          <ThemeToggle className="h-9 w-9 rounded-xl border-border/70 bg-surface-1 shadow-none" />
        </div>
      </header>

      {/* Featured card */}
      <section className="mt-6 px-6">
        <div
          className={`relative h-64 overflow-hidden rounded-3xl ${gradientClass[event.gradient as keyof typeof gradientClass]}`}
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

        {/* Description */}
        <p className="mt-6 text-base leading-relaxed text-foreground/80">
          {event.description}
        </p>
      </section>

      <div className="fixed bottom-[3.125rem] left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 px-6">
        <div className="rounded-2xl bg-background/85 p-1.5 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <Button
            asChild
            variant="ghost"
            className="h-8 w-full rounded-full bg-accent-lime px-5 text-xs font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            <Link href="/sign-up">Join — {event.price}</Link>
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}