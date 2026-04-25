"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return ctx
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyThemeToDocument(attribute: "class", resolved: "light" | "dark") {
  const el = document.documentElement
  if (attribute === "class") {
    el.classList.remove("light", "dark")
    el.classList.add(resolved)
  }
}

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  attribute?: "class"
  defaultTheme?: Theme
  enableSystem?: boolean
  storageKey?: string
  disableTransitionOnChange?: boolean
}) {
  const {
    attribute = "class",
    defaultTheme = "system",
    enableSystem = true,
    storageKey = "theme",
    disableTransitionOnChange = false,
  } = props

  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme
    const stored = window.localStorage.getItem(storageKey) as Theme | null
    return stored ?? defaultTheme
  })

  const resolvedTheme = React.useMemo<"light" | "dark">(() => {
    if (theme === "system") return enableSystem ? getSystemTheme() : "light"
    return theme
  }, [theme, enableSystem])

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeState(next)
      try {
        window.localStorage.setItem(storageKey, next)
      } catch {
        // ignore write failures (private mode / blocked storage)
      }
    },
    [storageKey],
  )

  React.useEffect(() => {
    if (disableTransitionOnChange) {
      const style = document.createElement("style")
      style.appendChild(
        document.createTextNode(
          "*{transition:none!important}html{scroll-behavior:auto!important}",
        ),
      )
      document.head.appendChild(style)
      requestAnimationFrame(() => {
        style.remove()
      })
    }

    applyThemeToDocument(attribute, resolvedTheme)
  }, [attribute, resolvedTheme, disableTransitionOnChange])

  React.useEffect(() => {
    if (!enableSystem) return
    if (theme !== "system") return

    const media = window.matchMedia?.("(prefers-color-scheme: dark)")
    if (!media) return
    const onChange = () => applyThemeToDocument(attribute, getSystemTheme())

    media.addEventListener?.("change", onChange)
    return () => media.removeEventListener?.("change", onChange)
  }, [attribute, enableSystem, theme])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
