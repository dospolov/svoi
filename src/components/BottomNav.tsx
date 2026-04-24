"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, Bookmark, User, type LucideIcon } from "lucide-react";

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
  { to: "/you", label: "You", Icon: User, enabled: false },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 px-4 pb-4">
      <div className="flex items-center justify-around rounded-full border border-border/60 bg-surface-1/85 px-2 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        {items.map(({ to, label, Icon, enabled }) => {
          const active = enabled && pathname === "/";
          const cls = `flex w-16 flex-col items-center gap-1 ${
            enabled ? "" : "opacity-50 pointer-events-none"
          }`;
          const iconCls = `h-5 w-5 transition-colors ${
            active ? "text-accent-lime" : "text-muted-foreground"
          }`;
          const labelCls = `text-mono-label transition-colors ${
            active ? "text-accent-lime" : "text-muted-foreground"
          }`;
          if (enabled) {
            return (
              <Link key={to} href="/" className={cls} aria-label={label}>
                <Icon className={iconCls} strokeWidth={active ? 2.5 : 2} />
                <span className={labelCls}>{label}</span>
              </Link>
            );
          }
          return (
            <span key={to} className={cls} aria-label={label}>
              <Icon className={iconCls} strokeWidth={2} />
              <span className={labelCls}>{label}</span>
            </span>
          );
        })}
      </div>
    </nav>
  );
}

