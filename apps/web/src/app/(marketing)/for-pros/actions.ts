'use server';

import { z } from 'zod';

const TRADE_KEYS = [
  'pressure_washing',
  'landscaping',
  'junk_removal',
  'window_gutter',
  'handyman',
  'pest_control',
] as const;

const ApplicationSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a phone number.')
    .max(32)
    .regex(/^[+()\-.\s\d]+$/, 'Phone number contains unexpected characters.'),
  service_area: z.string().trim().min(2, 'Please enter your service area.').max(160),
  trades: z
    .array(z.enum(TRADE_KEYS))
    .min(1, 'Pick at least one trade you cover.'),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
});

export type ApplyResult =
  | { ok: true; message: string }
  | { ok: false; fieldErrors: Record<string, string[]> };

export async function applyToRoster(
  _prev: ApplyResult | null,
  formData: FormData,
): Promise<ApplyResult> {
  const parsed = ApplicationSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    service_area: formData.get('service_area'),
    trades: formData.getAll('trades'),
    notes: formData.get('notes') ?? '',
  });

  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // In M5 (Subcontractor roster milestone) this writes a row to subcontractor_roster
  // with status='invited', creates a magic-link onboarding token, and notifies the operator
  // via SMS. Until the schema and Resend wiring land we acknowledge and let ops follow up.
  return {
    ok: true,
    message: `Thanks, ${parsed.data.name}. We'll text you at ${parsed.data.phone} within a couple of business days.`,
  };
}
