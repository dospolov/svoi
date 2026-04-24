export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">About</h1>

      <p className="mt-6 text-lg text-muted-foreground">
        This page explains who we are, what we do, and why this product exists.
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">Our mission</h2>
        <p className="text-muted-foreground">
          We build simple, useful tools that help people solve real problems
          without unnecessary complexity.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">What we value</h2>
        <p className="text-muted-foreground">
          Clarity, reliability, speed, and practical design.
        </p>
      </section>
    </main>
  );
}