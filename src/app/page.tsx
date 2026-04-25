import { Plus } from "lucide-react"
import { BottomNav } from "@/components/BottomNav"
import { api, getConvexClient } from "@/lib/convex"
import { Button } from "@/components/ui/button"
import { FeedEventsSection } from "@/components/FeedEventsSection"

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

      </header>
      <FeedEventsSection events={events} />

      <BottomNav />
    </div>
  )
}

