'use client';

import { useActionState } from 'react';
import { applyToRoster, type ApplyResult } from './actions';

const TRADES: { key: string; label: string }[] = [
  { key: 'pressure_washing', label: 'Pressure washing' },
  { key: 'landscaping', label: 'Landscaping' },
  { key: 'junk_removal', label: 'Junk removal' },
  { key: 'window_gutter', label: 'Window & gutter' },
  { key: 'handyman', label: 'Handyman & carpentry' },
  { key: 'pest_control', label: 'Pest control' },
];

export function ApplicationForm() {
  const [state, formAction, pending] = useActionState<ApplyResult | null, FormData>(
    applyToRoster,
    null,
  );

  if (state?.ok) {
    return (
      <div
        role="status"
        className="mt-10 rounded-lg border border-brand-300 bg-brand-50 p-6 text-ink"
      >
        <p className="font-display text-lg text-brand-800">Got it.</p>
        <p className="mt-2 text-ink/80">{state.message}</p>
      </div>
    );
  }

  const errors = !state?.ok ? (state?.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} className="mt-10 grid gap-6">
      <Field
        label="Your name"
        name="name"
        type="text"
        autoComplete="name"
        required
        errors={errors.name}
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        required
        placeholder="(912) 555-0123"
        errors={errors.phone}
      />
      <Field
        label="Service area"
        name="service_area"
        type="text"
        required
        placeholder="e.g. Savannah, Pooler, Tybee Island"
        errors={errors.service_area}
      />
      <fieldset>
        <legend className="text-sm font-medium text-ink">Trades you cover</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {TRADES.map((t) => (
            <label key={t.key} className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                name="trades"
                value={t.key}
                className="h-4 w-4 rounded border-brand-300"
              />
              {t.label}
            </label>
          ))}
        </div>
        {errors.trades?.[0] && (
          <p className="mt-2 text-sm text-roof-red">{errors.trades[0]}</p>
        )}
      </fieldset>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">Anything else we should know?</span>
        <textarea
          name="notes"
          rows={4}
          className="rounded-md border border-brand-300 bg-paper px-3 py-2 text-ink placeholder:text-ink/40 focus:border-brand-600 focus:outline-none"
          placeholder="Years in the trade, equipment you own, references, etc."
        />
        {errors.notes?.[0] && <span className="text-sm text-roof-red">{errors.notes[0]}</span>}
      </label>
      <button
        type="submit"
        disabled={pending}
        className="justify-self-start rounded-md bg-brand-700 px-6 py-3 text-paper hover:bg-brand-800 disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send application'}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  placeholder,
  autoComplete,
  errors,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean | undefined;
  placeholder?: string | undefined;
  autoComplete?: string | undefined;
  errors?: string[] | undefined;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-roof-red"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="rounded-md border border-brand-300 bg-paper px-3 py-2 text-ink placeholder:text-ink/40 focus:border-brand-600 focus:outline-none"
      />
      {errors?.[0] && <span className="text-sm text-roof-red">{errors[0]}</span>}
    </label>
  );
}
