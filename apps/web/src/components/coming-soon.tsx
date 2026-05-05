import Link from 'next/link';

export function ComingSoon({
  title,
  phase,
  blurb,
}: {
  title: string;
  phase: string;
  blurb: string;
}) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-20">
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand-600">
        {phase}
      </p>
      <h1 className="font-display text-4xl tracking-tight text-ink md:text-5xl">{title}</h1>
      <p className="mt-6 text-lg text-ink/80">{blurb}</p>
      <p className="mt-10 text-sm text-ink/60">
        <Link href="/" className="hover:text-brand-700">
          ← Back to One Roof Homes
        </Link>
      </p>
    </main>
  );
}
