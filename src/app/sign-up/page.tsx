"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useConvexAuth, useMutation, useQuery } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "../../../convex/_generated/api"

export default function SignUpPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const viewer = useQuery(api.users.viewer, {})
  const { signIn } = useAuthActions()
  const upsertMyName = useMutation(api.users.upsertMyName)
  const [nextParam, setNextParam] = useState<string | null>(null)
  const isSafeNext =
    typeof nextParam === "string" &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//")
  const redirectTo = isSafeNext ? nextParam : "/you"
  const signInHref =
    isSafeNext
      ? `/sign-in?next=${encodeURIComponent(nextParam)}`
      : "/sign-in"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("Poland")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const [pendingProfile, setPendingProfile] = useState<{
    name: string
    city: string
    age: string
    email: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setNextParam(new URLSearchParams(window.location.search).get("next"))
  }, [])

  useEffect(() => {
    if (!pendingProfile || isAuthLoading || !isAuthenticated) {
      return
    }

    let isCancelled = false
    const saveProfile = async () => {
      try {
        await upsertMyName(pendingProfile)
        if (!isCancelled) {
          setPendingProfile(null)
          router.replace(redirectTo)
        }
      } catch (e) {
        if (!isCancelled) {
          setError(e instanceof Error ? e.message : "Failed to sign up")
          setSubmitting(false)
          setPendingProfile(null)
        }
      }
    }

    void saveProfile()
    return () => {
      isCancelled = true
    }
  }, [
    pendingProfile,
    isAuthLoading,
    isAuthenticated,
    upsertMyName,
    redirectTo,
    router,
  ])

  useEffect(() => {
    if (!pendingProfile || isAuthenticated || isAuthLoading) {
      return
    }

    const timer = window.setTimeout(() => {
      setError("Authentication is taking too long. Please try again.")
      setPendingProfile(null)
      setSubmitting(false)
    }, 8000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [pendingProfile, isAuthenticated, isAuthLoading])

  useEffect(() => {
    if (!viewer || pendingProfile) {
      return
    }
    router.replace(redirectTo)
  }, [viewer, pendingProfile, redirectTo, router])

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-background px-6 pb-32 pt-12 text-foreground">
      <Card className="bg-surface-1">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="font-serif text-3xl italic leading-none">
                Sign up
              </CardTitle>
              <CardDescription className="mt-1">Create your account.</CardDescription>
            </div>
            <ThemeToggle className="h-9 w-9 rounded-xl border-border/70 bg-background/85 shadow-none backdrop-blur-sm" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
          <Input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="address-level2"
            required
          />
          <Input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            autoComplete="country-name"
            required
          />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Gender</p>
            <RadioGroup
              value={gender}
              onValueChange={setGender}
              className="flex items-center gap-6 rounded-md border border-input px-3 py-2"
              aria-required="true"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="gender-male" value="male" />
                <Label htmlFor="gender-male">male</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="gender-female" value="female" />
                <Label htmlFor="gender-female">female</Label>
              </div>
            </RadioGroup>
          </div>
          <Input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min={1}
            inputMode="numeric"
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            type="button"
            className="w-full rounded-full"
            disabled={submitting || !!pendingProfile}
            onClick={async () => {
              if (!name.trim() || !city.trim() || !country.trim() || !gender.trim() || !age.trim()) {
                setError("Please fill in all required fields.")
                return
              }
              if (!email.trim()) {
                setError("Email is required.")
                return
              }
              if (!password.trim()) {
                setError("Password is required for password sign up.")
                return
              }

              if (!Number.isInteger(Number(age)) || Number(age) < 1) {
                setError("Please enter a valid age.")
                return
              }

              setSubmitting(true)
              setError(null)
              try {
                const formData = new FormData()
                formData.set("email", email.trim())
                formData.set("password", password.trim())
                formData.set("flow", "signUp")
                await signIn("password", formData)
                setPendingProfile({
                  name: name.trim(),
                  city: city.trim(),
                  age: age.trim(),
                  email: email.trim(),
                })
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to sign up")
                setSubmitting(false)
              }
            }}
          >
            Sign up
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-foreground underline underline-offset-4" href={signInHref}>
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

