"use client"

import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type EventSearchToggleProps = {
  value: string
  onChange: (value: string) => void
}

export function EventSearchToggle({ value, onChange }: EventSearchToggleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    onChange("")
  }

  return (
    <div className="mt-8 flex justify-end">
      <div
        className={`overflow-hidden rounded-2xl border border-input/70 bg-background/80 backdrop-blur-sm transition-all duration-200 ${
          isOpen ? "w-full max-w-[260px] px-1 py-1" : "w-9 p-0"
        }`}
      >
        {isOpen ? (
          <div className="flex items-center gap-1">
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search events"
              aria-label="Search events"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="h-8 border-none bg-transparent px-2 shadow-none focus-visible:ring-0"
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Collapse search"
              onClick={handleClose}
            >
              <X className="size-5" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Open event search"
            onClick={() => setIsOpen(true)}
            className="h-9 w-9 rounded-xl border border-input/70 bg-background/80"
          >
            <Search className="size-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
