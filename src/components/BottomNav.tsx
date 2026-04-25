"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Search, Bookmark, User, type LucideIcon } from "lucide-react"

type Item = {
  to: string;
  label: string;
  Icon: LucideIcon;
  enabled: boolean;
};

const items: Item[] = [
  { to: "/", label: "Feed", Icon: Home, enabled: true },
  { to: "/discover", label: "Map", Icon: Search, enabled: false },
  { to: "/saved", label: "Saved", Icon: Bookmark, enabled: false },
  { to: "/you", label: "You", Icon: User, enabled: true },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 px-4 pb-2">
      <div className="flex items-center justify-around rounded-full border border-border/60 bg-surface-1/85 px-1 py-1.5 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-[oklch(0.2_0.02_250_/_0.78)] dark:shadow-[0_-10px_36px_rgba(0,0,0,0.65)]">
        {items.map(({ to, label, Icon, enabled }) => {
          const active = enabled && pathname === to
          const cls = `flex w-14 flex-col items-center gap-0.5 ${
            enabled ? "" : "opacity-50 pointer-events-none"
          }`
          const iconCls = `h-4 w-4 transition-colors ${
            active
              ? "text-accent-lime dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]"
              : "text-muted-foreground"
          }`
          const labelCls = `text-[10px] leading-none tracking-[0.08em] transition-colors ${
            active
              ? "text-accent-lime dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.14)]"
              : "text-muted-foreground"
          }`
          if (enabled) {
            return (
              <Link key={to} href={to} className={cls} aria-label={label}>
                <Icon className={iconCls} strokeWidth={active ? 2.5 : 2} />
                <span className={labelCls}>{label}</span>
              </Link>
            )
          }
          return (
            <span key={to} className={cls}>
              <Icon className={iconCls} strokeWidth={2} />
              <span className={labelCls}>{label}</span>
            </span>
          )
        })}
      </div>
    </nav>
  )
}

