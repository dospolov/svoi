"use client"

import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react"
import { Button } from "@/components/ui/button"

type EventDateSortToggleProps = {
  descending: boolean
  onChange: (descending: boolean) => void
}

export function EventDateSortToggle({ descending, onChange }: EventDateSortToggleProps) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label={
        descending
          ? "Sort by event date: latest first. Press to show earliest first."
          : "Sort by event date: earliest first. Press to show latest first."
      }
      onClick={() => onChange(!descending)}
      className="h-9 w-9 rounded-xl border border-input/70 bg-background/80"
    >
      {descending ? (
        <ArrowDownWideNarrow className="size-5" />
      ) : (
        <ArrowUpWideNarrow className="size-5" />
      )}
    </Button>
  )
}
