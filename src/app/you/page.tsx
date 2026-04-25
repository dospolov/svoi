"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery } from "convex/react"
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
  const { signOut } = useAuthActions()
  const [name, setName] = useState("")
  const [profession, setProfession] = useState("")
  const [city, setCity] = useState("")
  const [age, setAge] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [instagram, setInstagram] = useState("")
  const [telegram, setTelegram] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [youtube, setYoutube] = useState("")
  const [tiktok, setTiktok] = useState("")
  const [otherSocial, setOtherSocial] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [didInitProfileFields, setDidInitProfileFields] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const displayName = useMemo(
    () => viewer?.name ?? viewer?.email ?? viewer?.subject ?? "Signed in",
    [viewer]
  )

  useEffect(() => {
    if (!viewer || didInitProfileFields) {
      return
    }

    setName(viewer.name ?? "")
    setProfession(viewer.profession ?? "")
    setEmail(viewer.email ?? "")
    setDidInitProfileFields(true)
  }, [viewer, didInitProfileFields])

  useEffect(() => {
    const contentEl = contentRef.current
    if (!contentEl) {
      return
    }

    const updateScrollHint = () => {
      const hasMore = contentEl.scrollHeight - contentEl.scrollTop - contentEl.clientHeight > 8
      setShowScrollHint(hasMore)
    }

    updateScrollHint()
    contentEl.addEventListener("scroll", updateScrollHint)
    window.addEventListener("resize", updateScrollHint)

    return () => {
      contentEl.removeEventListener("scroll", updateScrollHint)
      window.removeEventListener("resize", updateScrollHint)
    }
  }, [])

  const toggleInterest = (interest: string, checked: boolean) => {
    setInterests((prev) =>
      checked ? [...prev, interest] : prev.filter((item) => item !== interest)
    )
  }

  const handleSaveChanges = async () => {
    const nextName = name.trim()
    if (!nextName) {
      toast.error("Name is required")
      return
    }

    setIsSaving(true)
    try {
      await upsertMyName({
        name: nextName,
        profession: profession.trim(),
      })
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to save profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (viewer === undefined) {
    return (
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-background px-6 pb-32 pt-12 text-foreground">
        <p className="text-mono-label text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!viewer) {
    return (
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-background px-6 pb-32 pt-12 text-foreground">
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
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-background px-6 pb-32 pt-12 text-foreground">
      <Card className="flex h-[calc(100vh-4.75rem)] max-h-[calc(100vh-4.75rem)] flex-col bg-surface-1">
        <CardHeader>
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
        <CardContent
          ref={contentRef}
          className="relative flex-1 space-y-4 overflow-y-auto [scrollbar-gutter:stable_both-edges]"
        >
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={viewer?.name ?? "Enter your name"}
              autoComplete="name"
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-password">Password</Label>
            <Input
              id="profile-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a new password"
              autoComplete="new-password"
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
          {showScrollHint ? (
            <div className="pointer-events-none sticky bottom-0 -mx-6 mt-2 bg-gradient-to-t from-surface-1 via-surface-1/90 to-transparent pb-1 pt-5 text-center text-[11px] text-muted-foreground">
              Scroll for more
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-6">
          <div className="w-full rounded-2xl bg-background/85 p-1.5 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <Button
              type="button"
              className="h-9 w-full rounded-full"
              disabled={isSaving}
              onClick={handleSaveChanges}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full"
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
