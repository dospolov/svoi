"use client"

import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type EventDateFilterToggleProps = {
  value: Date[]
  onChange: (value: Date[]) => void
}

function getDateSummaryLabel(value: Date[]) {
  if (value.length === 0) {
    return "All dates"
  }
  if (value.length === 1) {
    return value[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }
  return `${value.length} dates selected`
}

export function EventDateFilterToggle({ value, onChange }: EventDateFilterToggleProps) {
  const summaryLabel = getDateSummaryLabel(value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Open date filter"
          className="h-9 w-9 rounded-xl border border-input/70 bg-background/80"
        >
          <CalendarIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <div className="px-2 pt-1 text-xs text-muted-foreground">{summaryLabel}</div>
        <Calendar
          mode="multiple"
          selected={value}
          onSelect={(selected) => onChange(selected ?? [])}
          className="rounded-md"
        />
        <div className="flex justify-end px-2 pb-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange([])}
            disabled={value.length === 0}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
