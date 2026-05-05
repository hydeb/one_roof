import Link from 'next/link';

export default function MarketingHome() {
  return (
    <main className="min-h-dvh">
      <Header />
      <Hero />
      <DualPromise />
      <PilotFooter />
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-brand-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl tracking-tight text-brand-700">
          One Roof <span className="text-roof-red">Homes</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-brand-700">
          <Link href="/contractors" className="hover:text-brand-900">
            Browse contractors
          </Link>
          <Link href="/for-pros" className="hover:text-brand-900">
            For pros
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-brand-700 px-4 py-2 text-paper hover:bg-brand-800"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <p className="mb-6 text-sm font-medium uppercase tracking-widest text-brand-600">
        Coastal Georgia · Now in pilot
      </p>
      <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl">
        Big enough to handle it.
        <br />
        <span className="text-brand-700">Small enough to care.</span>
      </h1>
      <p className="mt-8 max-w-2xl text-lg text-ink/80 md:text-xl">
        A vetted network of home services pros, a complete maintenance record for your home, and a
        guarantee that stands behind the work. Every contractor we surface is accountable to us —
        not just to themselves.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className="rounded-md bg-brand-700 px-6 py-3 text-center text-paper hover:bg-brand-800"
        >
          Find a contractor
        </Link>
        <Link
          href="/for-pros"
          className="rounded-md border border-brand-300 px-6 py-3 text-center text-brand-800 hover:border-brand-500 hover:bg-brand-50"
        >
          I&apos;m a contractor
        </Link>
      </div>
    </section>
  );
}

function DualPromise() {
  return (
    <section className="border-y border-brand-100 bg-brand-50">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:gap-16">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-brand-600">
            For homeowners
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink">
            &ldquo;That&apos;s a One Roof plumber.&rdquo;
          </h2>
          <p className="mt-4 text-ink/80">
            It means vetted, insured, on time, fair priced — and if anything goes wrong, the
            platform stands behind it. Real ratings tied to real jobs. A maintenance record that
            travels with your home.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink/80">
            <li>· Verified license, insurance, and background checks</li>
            <li>· Transparent quotes with scope locked in writing</li>
            <li>· On-platform messaging, scheduling, and payment</li>
            <li>· Workmanship guarantee on Branded jobs</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-brand-600">
            For contractors
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink">
            &ldquo;That&apos;s a One Roof customer.&rdquo;
          </h2>
          <p className="mt-4 text-ink/80">
            Scope is documented up front. Payment is guaranteed. Expectations are realistic. We
            absorb the back office — leads, invoicing, bookkeeping, 1099s, insurance — so you
            can focus on the trade.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink/80">
            <li>· Qualified, scoped, geo-matched leads</li>
            <li>· Stripe-backed payouts, typically next business day</li>
            <li>· Year-end Schedule C ready, group-rate insurance options</li>
            <li>· The brand on your truck — earned, defended, and revocable</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function PilotFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="font-display text-xl text-brand-700">One Roof Homes</p>
          <p className="mt-1 text-sm text-ink/60">
            A platform by EngSec LLC. Sister product to{' '}
            <a href="https://homedoctor.com" className="underline hover:text-brand-700">
              Home Doctor
            </a>
            .
          </p>
        </div>
        <div className="text-sm text-ink/60">
          <p>Pilot market: Savannah, GA · Tybee Island</p>
          <p className="mt-1">
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
          </p>
        </div>
      </div>
    </footer>
  );
}
