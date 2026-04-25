"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function YouPage() {
  const viewer = useQuery(api.users.viewer, {})
  const { signOut } = useAuthActions()

  if (viewer === undefined) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background px-6 pb-32 pt-12 text-foreground">
        <p className="text-mono-label text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!viewer) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background px-6 pb-32 pt-12 text-foreground">
        <Card className="bg-surface-1">
          <CardHeader>
            <CardTitle className="font-serif text-3xl italic leading-none">
              You
            </CardTitle>
            <CardDescription>
              Sign in to see your profile and saved events.
            </CardDescription>
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
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background px-6 pb-32 pt-12 text-foreground">
      <Card className="bg-surface-1">
        <CardHeader>
          <CardTitle className="font-serif text-3xl italic leading-none">
            Profile
          </CardTitle>
          <CardDescription>
            {viewer?.name ?? viewer?.email ?? viewer?.subject ?? "Signed in"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-mono-label text-muted-foreground">
            {viewer?.email ? `Email: ${viewer.email}` : null}
          </div>
        </CardContent>
        <CardFooter>
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
