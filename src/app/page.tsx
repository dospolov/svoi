import { BottomNav } from "@/components/BottomNav"
import { ThemeToggle } from "@/components/theme-toggle"
import { api, getConvexClient } from "@/lib/convex"
import { FeedEventsSection } from "@/components/FeedEventsSection"

export default async function FeedPage() {
  const client = getConvexClient()
  const events = await client.query(api.events.listEvents, {})

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background pb-32 text-foreground">
      <header className="px-6 pt-[max(0.25rem,env(safe-area-inset-top))]">
        <div className="relative overflow-hidden rounded-2xl border border-sky-200/60 bg-[linear-gradient(145deg,oklch(1_0_0_/_0.94),oklch(0.975_0.028_235_/_0.82)_52%,oklch(0.94_0.055_210_/_0.62))] p-3 shadow-[0_18px_44px_-28px_rgba(56,98,141,0.32)] backdrop-blur-xl dark:border-white/12 dark:bg-[linear-gradient(145deg,oklch(0.2_0.02_250_/_0.65),oklch(0.16_0.02_250_/_0.52)_55%,oklch(0.13_0.01_250_/_0.38))]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/45 via-white/15 to-transparent dark:from-white/20 dark:via-white/5"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/25 blur-2xl dark:bg-white/8"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-sky-200/35 blur-2xl dark:bg-sky-400/10"
          />
          <div className="absolute top-2 right-4 z-10">
            <ThemeToggle className="h-9 w-9 rounded-xl border border-input/70 bg-background/85 shadow-none backdrop-blur-sm" />
          </div>
          <div className="relative pr-12">
            <h1 className="font-serif text-[1.45rem] leading-snug tracking-tight sm:text-[1.6rem]">
              Host events, join meetups, build communities.
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Your hub for Warsaw's best communities.
            </p>
          </div>
        </div>
      </header>
      <FeedEventsSection events={events} />

      <BottomNav />
    </div>
  )
}
