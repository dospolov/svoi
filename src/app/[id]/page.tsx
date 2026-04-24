type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{id}</h1>

      <p className="mt-6 text-lg text-muted-foreground">
        Dynamic page for id: <span className="font-medium">{id}</span>
      </p>
    </main>
  );
}