"use client"

import { BottomNav } from "@/components/BottomNav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SavedPage() {
  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-background px-6 pt-[max(0.375rem,env(safe-area-inset-top))] pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+3rem))] text-foreground">
      <Card className="flex min-h-0 flex-1 flex-col border-border/60 bg-surface-1/90 p-3 shadow-sm">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h1 className="font-serif text-3xl italic leading-none">Saved</h1>
            <ThemeToggle className="h-9 w-9 rounded-xl border-border/70 bg-background/85 shadow-none backdrop-blur-sm" />
          </div>
          <Tabs defaultValue="events" className="flex min-h-0 flex-1 flex-col gap-3">
            <TabsList className="grid w-full shrink-0 grid-cols-4">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="chats">Chats</TabsTrigger>
              <TabsTrigger value="created">Created</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>
            <CardContent className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border/50 bg-background/80 py-5 text-sm text-muted-foreground">
              <TabsContent value="events">Saved events will appear here.</TabsContent>
              <TabsContent value="chats">Saved chats will appear here.</TabsContent>
              <TabsContent value="created">
                Your created events will appear here.
              </TabsContent>
              <TabsContent value="friends">Saved friends will appear here.</TabsContent>
            </CardContent>
          </Tabs>
      </Card>
      <BottomNav />
    </div>
  )
}
