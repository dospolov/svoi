import { notFound } from "next/navigation"
import { EventDetail } from "./event-detail"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params
  if (!id) {
    notFound()
  }
  return <EventDetail slug={id} />
}
