import Link from 'next/link';

const PHONE_DISPLAY = '(912) 521-5676';
const PHONE_HREF = 'tel:+19125215676';

const SERVICES = [
  {
    title: 'Pressure washing',
    blurb: 'Driveways, siding, decks, pool decks, fences. Soft-wash for delicate surfaces.',
  },
  {
    title: 'Landscaping',
    blurb: 'Yard cleanups, mulch, hedges, seasonal refresh. Recurring or one-time.',
  },
  {
    title: 'Junk removal',
    blurb: 'Single items to whole-room hauls. Move-out, post-storm, attic clear-outs.',
  },
  {
    title: 'Window & gutter',
    blurb: 'Interior and exterior window cleaning, gutter clear-out, downspout flush.',
  },
  {
    title: 'Handyman & carpentry',
    blurb: 'Small repairs, trim work, doors, fence boards, deck boards, punch-list jobs.',
  },
  {
    title: 'Pest control',
    blurb: 'Quarterly perimeter, ant and roach treatment, mosquito knock-down for events.',
  },
];

export default function MarketingHome() {
  return (
    <main className="min-h-dvh">
      <Header />
      <Hero />
      <ServiceList />
      <HowItWorks />
      <ClosingCTA />
      <PilotFooter />
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
        <nav className="flex items-center gap-3 text-sm text-brand-700 sm:gap-6">
          <Link href="/for-pros" className="hidden hover:text-brand-900 sm:inline">
            For pros
          </Link>
          <a
            href={PHONE_HREF}
            className="rounded-md bg-brand-700 px-4 py-2 font-medium text-paper hover:bg-brand-800"
          >
            Call {PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <p className="mb-6 text-sm font-medium uppercase tracking-widest text-brand-600">
        Savannah, GA · Free estimates
      </p>
      <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl">
        One call. One team.
        <br />
        <span className="text-brand-700">One Roof.</span>{' '}
        <span className="text-roof-red">We handle it.</span>
      </h1>
      <p className="mt-8 max-w-2xl text-lg text-ink/80 md:text-xl">
        I handle everything outside your home — pressure washing, gutters, yard cleanup, small
        repairs, and more. Instead of calling five different people, you call one number and I
        handle it.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a
          href={PHONE_HREF}
          className="rounded-md bg-brand-700 px-6 py-3 text-center text-paper hover:bg-brand-800"
        >
          Call for a free estimate · {PHONE_DISPLAY}
        </a>
        <a
          href={`sms:+19125215676?&body=${encodeURIComponent('Hi — I’d like a free estimate for ')}`}
          className="rounded-md border border-brand-300 px-6 py-3 text-center text-brand-800 hover:border-brand-500 hover:bg-brand-50"
        >
          Text us
        </a>
      </div>
      <p className="mt-6 text-sm text-ink/60">
        Insured · Local · Single point of contact for everything outside your home.
      </p>
    </section>
  );
}

function ServiceList() {
  return (
    <section className="border-y border-brand-100 bg-brand-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-600">What we do</p>
        <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          Big enough to handle it. Small enough to care.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-lg border border-brand-100 bg-paper p-6 shadow-sm"
            >
              <h3 className="font-display text-xl text-brand-800">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.blurb}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-ink/60">
          Don&apos;t see what you need?{' '}
          <a href={PHONE_HREF} className="underline hover:text-brand-700">
            Call and ask.
          </a>{' '}
          If we don&apos;t do it ourselves, we usually know who does.
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'You call or text',
      body: 'Tell me what you need. I ask a few questions — sometimes I can quote on the spot, sometimes I’ll come look.',
    },
    {
      n: '02',
      title: 'You get a written estimate',
      body: 'Scope locked in writing, fair pricing, no surprises. You sign and we book a date.',
    },
    {
      n: '03',
      title: 'We do the work',
      body: 'My crew shows up in One Roof shirts, does the job, cleans up, sends you photos when it’s done.',
    },
    {
      n: '04',
      title: 'You pay one invoice',
      body: 'One invoice from One Roof. One number to call if anything isn’t right. We stand behind the work.',
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-brand-600">How it works</p>
      <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">Four steps. No runaround.</h2>
      <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n}>
            <p className="font-display text-3xl text-roof-red">{s.n}</p>
            <p className="mt-2 font-display text-lg text-brand-800">{s.title}</p>
            <p className="mt-2 text-sm text-ink/70">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section className="border-t border-brand-100 bg-brand-700 text-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl md:text-4xl">Ready to stop juggling contractors?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-paper/80">
          Free estimates. Local crew. One number for everything outside your home.
        </p>
        <a
          href={PHONE_HREF}
          className="mt-8 inline-block rounded-md bg-roof-red px-6 py-3 font-medium text-paper hover:opacity-90"
        >
          Call {PHONE_DISPLAY}
        </a>
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
            Serving Savannah, GA. A platform by EngSec LLC.
          </p>
        </div>
        <div className="text-sm text-ink/60">
          <p>
            <a href={PHONE_HREF} className="hover:text-brand-700">
              {PHONE_DISPLAY}
            </a>
          </p>
          <p className="mt-1">
            <Link href="/for-pros" className="hover:text-brand-700">
              For pros
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
          </p>
        </div>
      </div>
    </footer>
  );
}
