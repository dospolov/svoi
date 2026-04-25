"use client"

import { Tags } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ALL_EVENT_INTERESTS,
  EVENT_INTEREST_GROUPS,
} from "@/lib/eventInterests"

type EventInterestsFilterToggleProps = {
  value: string[]
  onChange: (value: string[]) => void
}

export function EventInterestsFilterToggle({
  value,
  onChange,
}: EventInterestsFilterToggleProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selected = useMemo(() => new Set(value), [value])

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) {
      return EVENT_INTEREST_GROUPS
    }
    return EVENT_INTEREST_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(q)),
    })).filter((group) => group.items.length > 0)
  }, [search])

  const toggleId = (id: string, checked: boolean) => {
    const next = new Set(selected)
    if (checked) {
      next.add(id)
    } else {
      next.delete(id)
    }
    onChange([...next])
  }

  const selectEntireCatalog = () => {
    onChange(ALL_EVENT_INTERESTS.map((i) => i.id))
  }

  const clearEntireSelection = () => {
    onChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Open interests filter"
          className="relative h-9 w-9 shrink-0 rounded-xl border border-input/70 bg-background/80"
        >
          <Tags className="size-5" />
          {value.length > 0 ? (
            <span
              className="absolute top-1 right-1 size-2 rounded-full bg-primary"
              aria-hidden
            />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-[min(calc(100vw-2rem),22rem)] max-w-[min(calc(100vw-2rem),22rem)] flex-col gap-3 p-3"
      >
        <PopoverHeader className="gap-0.5">
          <PopoverTitle>Interests</PopoverTitle>
          <p className="text-xs text-muted-foreground">
            {value.length === 0
              ? "Pick any number — events must match at least one."
              : `${value.length} selected`}
          </p>
        </PopoverHeader>

        <Input
          type="search"
          placeholder="Search interests…"
          aria-label="Search interests"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9"
        />

        <div className="flex flex-wrap gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={selectEntireCatalog}
          >
            Select all
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={clearEntireSelection}
          >
            Clear all
          </Button>
        </div>

        <div className="max-h-[min(55vh,360px)] space-y-3 overflow-y-auto overscroll-contain pr-1">
          {filteredGroups.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No interests match your search.
            </p>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.heading}>
                <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {group.heading}
                </p>
                <ul className="space-y-2">
                  {group.items.map((item) => {
                    const checkboxId = `interest-${item.id}`
                    const isChecked = selected.has(item.id)
                    return (
                      <li key={item.id}>
                        <Label
                          htmlFor={checkboxId}
                          className="cursor-pointer gap-2.5 rounded-lg py-1 pr-2 font-normal has-[[data-slot=checkbox]:focus-visible]:ring-2 has-[[data-slot=checkbox]:focus-visible]:ring-ring/50"
                        >
                          <Checkbox
                            id={checkboxId}
                            checked={isChecked}
                            onCheckedChange={(state) =>
                              toggleId(item.id, state === true)
                            }
                          />
                          <span className="line-clamp-2 text-sm leading-snug">
                            {item.label}
                          </span>
                        </Label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
