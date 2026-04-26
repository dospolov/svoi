"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useAuthActions } from "@convex-dev/auth/react"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const interestOptions = [
  "Sports",
  "Music",
  "Movies",
  "Travel",
  "Business",
  "Technology",
  "Art",
  "Languages",
] as const

export default function YouPage() {
  const viewer = useQuery(api.users.viewer, {})
  const upsertMyName = useMutation(api.users.upsertMyName)
  const changeMyPassword = useAction(api.users.changeMyPassword)
  const { signOut } = useAuthActions()
  const [name, setName] = useState("")
  const [profession, setProfession] = useState("")
  const [city, setCity] = useState("")
  const [age, setAge] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [instagram, setInstagram] = useState("")
  const [telegram, setTelegram] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [youtube, setYoutube] = useState("")
  const [tiktok, setTiktok] = useState("")
  const [otherSocial, setOtherSocial] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const displayName = useMemo(
    () => viewer?.name ?? viewer?.email ?? viewer?.subject ?? "Signed in",
    [viewer]
  )

  /** Re-hydrate when Convex pushes newer profile (avoids one-shot init racing signup upsert). */
  const serverProfileSignature = useMemo(() => {
    if (!viewer) {
      return null
    }
    return [
      viewer.subject,
      viewer.name ?? "",
      viewer.profession ?? "",
      viewer.city ?? "",
      viewer.age ?? "",
      viewer.email ?? "",
    ].join("\u0001")
  }, [viewer])

  useEffect(() => {
    if (!viewer || serverProfileSignature === null) {
      return
    }

    setName(viewer.name ?? "")
    setProfession(viewer.profession ?? "")
    setCity(viewer.city ?? "")
    setAge(viewer.age ?? "")
    setEmail(viewer.email ?? "")
  }, [viewer, serverProfileSignature])

  const toggleInterest = (interest: string, checked: boolean) => {
    setInterests((prev) =>
      checked ? [...prev, interest] : prev.filter((item) => item !== interest)
    )
  }

  const handleSaveChanges = async () => {
    const nextName = name.trim()
    const nextCity = city.trim()
    const nextAge = age.trim()
    const nextEmail = email.trim()
    if (!nextName) {
      toast.error("Name is required")
      return
    }
    if (!nextCity) {
      toast.error("City is required")
      return
    }
    if (!nextAge) {
      toast.error("Age is required")
      return
    }
    if (!Number.isInteger(Number(nextAge)) || Number(nextAge) < 1) {
      toast.error("Please enter a valid age")
      return
    }
    if (!nextEmail) {
      toast.error("Email is required")
      return
    }
    const nextNewPassword = newPassword.trim()
    const nextCurrentPassword = currentPassword.trim()
    if (nextNewPassword && !nextCurrentPassword) {
      toast.error("Enter your current password to set a new password")
      return
    }
    setIsSaving(true)
    try {
      if (nextNewPassword) {
        await changeMyPassword({
          currentPassword: nextCurrentPassword,
          newPassword: nextNewPassword,
        })
      }
      await upsertMyName({
        name: nextName,
        profession: profession.trim(),
        city: nextCity,
        age: nextAge,
        email: nextEmail,
      })
      setCurrentPassword("")
      setNewPassword("")
      toast.success(
        nextNewPassword ? "Profile and password updated" : "Profile updated"
      )
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  if (viewer === undefined) {
    return (
      <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-background px-6 pt-[max(0.25rem,env(safe-area-inset-top))] pb-[max(0.25rem,env(safe-area-inset-bottom))] text-foreground">
        <Card className="flex min-h-0 flex-1 flex-col gap-2 bg-surface-1 py-1">
          <CardHeader className="shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="font-serif text-3xl italic leading-none">
                  Profile
                </CardTitle>
                <CardDescription className="mt-1">
                  <Skeleton className="mt-1 h-4 w-40" />
                </CardDescription>
              </div>
              <ThemeToggle className="h-9 w-9 rounded-xl border-border/70 bg-background/85 shadow-none backdrop-blur-sm" />
            </div>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]">
            <div className="space-y-2">
              <Label htmlFor="profile-name-loading">Name</Label>
              <Skeleton id="profile-name-loading" className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-profession-loading">Profession</Label>
              <Skeleton id="profile-profession-loading" className="h-9 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="profile-city-loading">City</Label>
                <Skeleton id="profile-city-loading" className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-age-loading">Age</Label>
                <Skeleton id="profile-age-loading" className="h-9 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email-loading">Email</Label>
              <Skeleton id="profile-email-loading" className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-[7.25rem] w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-other-loading">Other</Label>
              <Skeleton id="profile-other-loading" className="min-h-[4.5rem] w-full" />
            </div>
          </CardContent>
          <CardFooter className="shrink-0 flex-col gap-2 border-t border-border/40 bg-surface-1 py-1.5">
            <Button type="button" className="h-9 w-full rounded-full" disabled>
              Save changes
            </Button>
            <Button type="button" variant="outline" className="h-9 w-full rounded-full" disabled>
              Sign out
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!viewer) {
    return (
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col justify-center bg-background px-6 py-12 text-foreground">
        <Card className="bg-surface-1">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="font-serif text-3xl italic leading-none">
                  You
                </CardTitle>
                <CardDescription className="mt-1">
                  Sign in to see your profile and saved events.
                </CardDescription>
              </div>
              <ThemeToggle className="h-9 w-9 rounded-xl border-border/70 bg-background/85 shadow-none backdrop-blur-sm" />
            </div>
          </CardHeader>
          <CardFooter className="gap-3">
            <Button asChild className="flex-1 rounded-full">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 rounded-full">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-background px-6 pt-[max(0.25rem,env(safe-area-inset-top))] pb-[max(0.25rem,env(safe-area-inset-bottom))] text-foreground">
      <Card className="flex min-h-0 flex-1 flex-col gap-2 bg-surface-1 py-1">
        <CardHeader className="shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="font-serif text-3xl italic leading-none">
                Profile
              </CardTitle>
              <CardDescription className="mt-1">{displayName}</CardDescription>
            </div>
            <ThemeToggle className="h-9 w-9 rounded-xl border-border/70 bg-background/85 shadow-none backdrop-blur-sm" />
          </div>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={viewer?.name ?? "Enter your name"}
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-profession">Profession</Label>
            <Input
              id="profile-profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Example: Product Designer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="profile-city">City</Label>
              <Input
                id="profile-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Warsaw"
                autoComplete="address-level2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-age">Age</Label>
              <Input
                id="profile-age"
                type="number"
                min={1}
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              id="profile-current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              autoComplete="current-password"
              aria-label="Current password"
            />
            <Input
              id="profile-new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
              aria-label="New password"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Interests</p>
            <div className="grid grid-cols-2 gap-2 rounded-md border border-input p-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    id={`interest-${interest}`}
                    checked={interests.includes(interest)}
                    onCheckedChange={(checked) =>
                      toggleInterest(interest, Boolean(checked))
                    }
                  />
                  <Label htmlFor={`interest-${interest}`}>{interest}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Social media</p>
            <div className="space-y-2">
              <Input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram"
              />
              <Input
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="Telegram"
              />
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp"
              />
              <Input
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="YouTube"
              />
              <Input
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="TikTok"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-other">Other</Label>
            <Textarea
              id="profile-other"
              value={otherSocial}
              onChange={(e) => setOtherSocial(e.target.value)}
              placeholder="Add other links or contacts"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="shrink-0 flex-col gap-2 border-t border-border/40 bg-surface-1 py-1.5">
          <Button
            type="button"
            className="h-9 w-full rounded-full"
            disabled={isSaving}
            onClick={handleSaveChanges}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full rounded-full"
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
