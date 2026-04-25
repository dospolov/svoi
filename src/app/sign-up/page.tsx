"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
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
  const viewer = useQuery(api.users.viewer, {})
  const { signIn } = useAuthActions()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("Poland")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (viewer) {
    router.replace("/you")
    return null
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background px-6 pb-32 pt-12 text-foreground">
      <Card className="bg-surface-1">
        <CardHeader>
          <CardTitle className="font-serif text-3xl italic leading-none">
            Sign up
          </CardTitle>
          <CardDescription>Create your account.</CardDescription>
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
            disabled={submitting}
            onClick={async () => {
              if (!name.trim() || !city.trim() || !country.trim() || !gender.trim() || !age.trim()) {
                setError("Please fill in all required fields.")
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
                formData.set("email", email)
                formData.set("password", password)
                formData.set("flow", "signUp")
                await signIn("password", formData)
                router.replace("/you")
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to sign up")
              } finally {
                setSubmitting(false)
              }
            }}
          >
            Sign up
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-foreground underline underline-offset-4" href="/sign-in">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

