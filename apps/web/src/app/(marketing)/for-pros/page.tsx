import Link from 'next/link';
import { ApplicationForm } from './application-form';

export default function ForProsPage() {
  return (
    <main className="min-h-dvh">
      <Header />
      <Hero />
      <Pitch />
      <FormSection />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-brand-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="font-display text-xl tracking-tight text-brand-700">
          One Roof <span className="text-roof-red">Homes</span>
        </Link>
        <nav className="text-sm text-brand-700">
          <Link href="/" className="hover:text-brand-900">
            ← Homeowners
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-6 text-sm font-medium uppercase tracking-widest text-brand-600">
        Subcontractor roster · Savannah, GA
      </p>
      <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-ink md:text-6xl">
        Steady work. Clean scope.
        <br />
        <span className="text-brand-700">We handle the customer.</span>
      </h1>
      <p className="mt-8 max-w-2xl text-lg text-ink/80">
        One Roof is the general contractor. You show up, do the trade you&apos;re great at, and
        get paid a flat fee per job. We bring the lead, write the estimate, collect the money,
        and own the customer relationship.
      </p>
    </section>
  );
}

function Pitch() {
  const points = [
    {
      title: 'Flat-fee per job',
      body: 'You quote your number, we add the GC margin. No bidding wars, no chasing payments — paid on a regular cadence.',
    },
    {
      title: 'No customer hunting',
      body: 'We bring the work. You never market, never invoice, never argue scope with a homeowner.',
    },
    {
      title: 'One Roof on the truck',
      body: 'You wear the One Roof shirt to the job. The customer knows you as One Roof — that’s how the math works.',
    },
    {
      title: 'A graduation path',
      body: 'Subs who deliver consistently can earn into the Branded program when it lights up — your own truck wrap, your own profile, marketplace leads. Until then, we keep it simple.',
    },
  ];
  return (
    <section className="border-y border-brand-100 bg-brand-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2">
        {points.map((p) => (
          <div key={p.title}>
            <h2 className="font-display text-xl text-brand-800">{p.title}</h2>
            <p className="mt-2 text-sm text-ink/70">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FormSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-brand-600">Apply</p>
      <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
        Tell us about your trade.
      </h2>
      <p className="mt-3 text-ink/70">
        We&apos;ll review and reach out. We&apos;re actively staffing pressure washing, landscaping,
        junk removal, window/gutter, and pest control in the Savannah area.
      </p>
      <ApplicationForm />
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-brand-100">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 md:flex-row md:items-center">
        <p className="font-display text-xl text-brand-700">One Roof Homes</p>
        <div className="text-sm text-ink/60">
          <Link href="/" className="hover:text-brand-700">
            Homeowners
          </Link>{' '}
          ·{' '}
          <Link href="/about" className="hover:text-brand-700">
            About
          </Link>{' '}
          ·{' '}
          <Link href="/privacy" className="hover:text-brand-700">
            Privacy
          </Link>{' '}
          ·{' '}
          <Link href="/terms" className="hover:text-brand-700">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
