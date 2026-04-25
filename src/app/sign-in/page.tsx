"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "../../../convex/_generated/api"

export default function SignInPage() {
  const router = useRouter()
  const viewer = useQuery(api.users.viewer, {})
  const { signIn } = useAuthActions()
  const [nextParam, setNextParam] = useState<string | null>(null)
  const isSafeNext = nextParam?.startsWith("/") && !nextParam.startsWith("//")
  const redirectTo = isSafeNext ? nextParam : "/"
  const signUpHref =
    isSafeNext
      ? `/sign-up?next=${encodeURIComponent(nextParam)}`
      : "/sign-up"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setNextParam(new URLSearchParams(window.location.search).get("next"))
  }, [])

  if (viewer) {
    router.replace(redirectTo)
    return null
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-background px-6 pb-32 pt-12 text-foreground">
      <div className="pointer-events-none absolute right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-10">
        <div className="pointer-events-auto">
          <ThemeToggle className="h-9 w-9 rounded-xl border-border/70 bg-background/85 shadow-none backdrop-blur-sm" />
        </div>
      </div>
      <Card className="bg-surface-1">
        <CardHeader>
          <CardTitle className="font-serif text-3xl italic leading-none">
            Sign in
          </CardTitle>
          <CardDescription>Welcome back.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            type="button"
            className="w-full rounded-full"
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true)
              setError(null)
              try {
                const formData = new FormData()
                formData.set("email", email)
                formData.set("password", password)
                formData.set("flow", "signIn")
                await signIn("password", formData)
                router.replace(redirectTo)
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to sign in")
              } finally {
                setSubmitting(false)
              }
            }}
          >
            Sign in
          </Button>
          <p className="text-sm text-muted-foreground">
            No account?{" "}
            <Link className="text-foreground underline underline-offset-4" href={signUpHref}>
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

