// packages/trades/savannah_phase1.ts
//
// One Roof Homes — Phase 1 Savannah trade taxonomy and pricing seed data.
// Source: PRD v1.2 Addendum A §2 (Phase 1 Service Scope) + partner's Pricing Cheat Sheet.
//
// This file drives:
//   - Quote builder default line items
//   - Pricing Cheat Sheet view in operator console
//   - Bundling prompts ("typical bundle adds ...")
//   - Margin warnings (when manual price falls below target margin)
//
// Phase 3+ this file is augmented (not replaced) with the full hierarchical taxonomy
// from PRD v1.1 §18.2.

export type RateUnit = 'per_job' | 'per_hour' | 'per_sqft' | 'per_unit';

export interface ServiceVariant {
  /** Stable key used in subcontractor_rate_sheet.service_key, job.requested_services, etc. */
  key: string;
  /** Display name for operator and customer UIs */
  display_name: string;
  /** Short customer-facing description */
  description: string;
  /** Default rate unit when quoting */
  default_rate_unit: RateUnit;
  /** Sell-price band shown in cheat sheet (USD) */
  sell_price_low: number;
  sell_price_high: number;
  /** Typical scope assumption for the band */
  scope_assumption: string;
  /** Indicates whether the operator typically self-performs this */
  typically_self_performed: boolean;
}

export interface ServiceCategory {
  /** Top-level category key */
  key: string;
  /** Display name */
  display_name: string;
  /** Short tagline used on door hangers, yard signs, truck magnets */
  tagline: string;
  /** Icon identifier (matches the brand kit's service icon set) */
  icon: 'pressure_washing' | 'landscaping' | 'junk_removal' | 'window_gutter' | 'handyman' | 'pest_control';
  /** Brand color from the One Roof palette */
  brand_color: string;  // hex
  /** Variants within this category */
  variants: ServiceVariant[];
  /** Target gross margin range (decimal, e.g., 0.40 = 40%) */
  target_margin_low: number;
  target_margin_high: number;
  /** Recurring service flag */
  is_recurring: boolean;
  /** Default recurrence interval if recurring */
  default_interval?: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  /** Whether the operator partners with a third party for this (e.g., pest control) */
  is_partnered: boolean;
}

// Brand palette (from One Roof Homes brand mark)
export const ONE_ROOF_NAVY = '#1F2D4E';
export const ONE_ROOF_GREEN = '#5A6B3B';
export const ONE_ROOF_ORANGE = '#C8782B';
export const ONE_ROOF_BROWN = '#7B5535';
export const ONE_ROOF_BLUE = '#2D6FA8';
export const ONE_ROOF_RED = '#A8423A';

// ============================================================================
// Phase 1 service catalog
// ============================================================================

export const PRESSURE_WASHING: ServiceCategory = {
  key: 'pressure_washing',
  display_name: 'Pressure Washing',
  tagline: 'Driveways, houses, patios & more',
  icon: 'pressure_washing',
  brand_color: ONE_ROOF_BLUE,
  target_margin_low: 0.40,
  target_margin_high: 0.50,
  is_recurring: false,
  is_partnered: false,
  variants: [
    {
      key: 'pressure_washing.driveway',
      display_name: 'Driveway',
      description: 'Concrete driveway pressure wash, oil-spot treatment included.',
      default_rate_unit: 'per_job',
      sell_price_low: 100,
      sell_price_high: 200,
      scope_assumption: 'Standard 2-car driveway up to ~1,000 sq ft',
      typically_self_performed: false,
    },
    {
      key: 'pressure_washing.house_wash',
      display_name: 'House Wash',
      description: 'Soft-wash siding, eaves, and trim. Mildew treatment included.',
      default_rate_unit: 'per_job',
      sell_price_low: 200,
      sell_price_high: 400,
      scope_assumption: 'Standard 2-story home, single-color siding',
      typically_self_performed: false,
    },
    {
      key: 'pressure_washing.bundle',
      display_name: 'Driveway + House Bundle',
      description: 'Both driveway and house wash. Most popular package.',
      default_rate_unit: 'per_job',
      sell_price_low: 250,
      sell_price_high: 500,
      scope_assumption: 'Standard 2-car driveway + standard 2-story home',
      typically_self_performed: false,
    },
    {
      key: 'pressure_washing.patio_deck',
      display_name: 'Patio / Deck',
      description: 'Concrete patio or wood deck. Wood-safe pressure for deck.',
      default_rate_unit: 'per_sqft',
      sell_price_low: 0.30,
      sell_price_high: 0.60,
      scope_assumption: 'Per square foot pricing',
      typically_self_performed: false,
    },
  ],
};

export const LANDSCAPING: ServiceCategory = {
  key: 'landscaping_simple',
  display_name: 'Landscaping (Simple Jobs)',
  tagline: 'Cleanups, mulch, trimming & maintenance',
  icon: 'landscaping',
  brand_color: ONE_ROOF_GREEN,
  target_margin_low: 0.30,
  target_margin_high: 0.50,
  is_recurring: true,
  default_interval: 'monthly',
  is_partnered: false,
  variants: [
    {
      key: 'landscaping_simple.cleanup',
      display_name: 'Yard Cleanup',
      description: 'Leaves, branches, general debris removal. Hauled away.',
      default_rate_unit: 'per_job',
      sell_price_low: 100,
      sell_price_high: 300,
      scope_assumption: 'Standard residential lot, light to moderate debris',
      typically_self_performed: false,
    },
    {
      key: 'landscaping_simple.mulch_install',
      display_name: 'Mulch Install',
      description: 'Mulch delivery and installation in beds. Edging optional.',
      default_rate_unit: 'per_job',
      sell_price_low: 300,
      sell_price_high: 800,
      scope_assumption: '5-15 yards of mulch installed',
      typically_self_performed: false,
    },
    {
      key: 'landscaping_simple.basic_maintenance',
      display_name: 'Basic Maintenance',
      description: 'Mowing, edging, blowing. Recurring monthly.',
      default_rate_unit: 'per_job',
      sell_price_low: 50,
      sell_price_high: 150,
      scope_assumption: 'Per visit, recurring',
      typically_self_performed: false,
    },
    {
      key: 'landscaping_simple.trimming',
      display_name: 'Hedge / Bush Trimming',
      description: 'Hedge and bush shaping. Cleanup included.',
      default_rate_unit: 'per_job',
      sell_price_low: 75,
      sell_price_high: 250,
      scope_assumption: 'Up to 6 standard hedges/bushes',
      typically_self_performed: false,
    },
  ],
};

export const JUNK_REMOVAL: ServiceCategory = {
  key: 'junk_removal',
  display_name: 'Junk Removal',
  tagline: "Haul it off. You don't lift a finger.",
  icon: 'junk_removal',
  brand_color: ONE_ROOF_ORANGE,
  target_margin_low: 0.40,
  target_margin_high: 0.60,
  is_recurring: false,
  is_partnered: false,
  variants: [
    {
      key: 'junk_removal.small_load',
      display_name: 'Small Load',
      description: '1-3 items or small furniture pile. Single-person job.',
      default_rate_unit: 'per_job',
      sell_price_low: 75,
      sell_price_high: 150,
      scope_assumption: 'Up to ~1/8 truck capacity',
      typically_self_performed: false,
    },
    {
      key: 'junk_removal.half_load',
      display_name: 'Half Load',
      description: 'Half-truck of debris, furniture, or yard waste.',
      default_rate_unit: 'per_job',
      sell_price_low: 200,
      sell_price_high: 400,
      scope_assumption: 'Up to ~1/2 truck capacity',
      typically_self_performed: false,
    },
    {
      key: 'junk_removal.full_load',
      display_name: 'Full Load',
      description: 'Full-truck haul. Garage cleanouts, estate cleanouts.',
      default_rate_unit: 'per_job',
      sell_price_low: 400,
      sell_price_high: 700,
      scope_assumption: 'Full truck capacity',
      typically_self_performed: false,
    },
  ],
};

export const WINDOW_GUTTER: ServiceCategory = {
  key: 'window_gutter',
  display_name: 'Window & Gutter Cleaning',
  tagline: 'Cleaner windows. Safer, clog-free gutters.',
  icon: 'window_gutter',
  brand_color: ONE_ROOF_NAVY,
  target_margin_low: 0.30,
  target_margin_high: 0.50,
  is_recurring: true,
  default_interval: 'biannual',
  is_partnered: false,
  variants: [
    {
      key: 'window_gutter.windows',
      display_name: 'Window Cleaning',
      description: 'Inside and outside, screens included. Streak-free.',
      default_rate_unit: 'per_job',
      sell_price_low: 100,
      sell_price_high: 250,
      scope_assumption: 'Standard 2-story home, ~15-25 windows',
      typically_self_performed: false,
    },
    {
      key: 'window_gutter.gutters',
      display_name: 'Gutter Cleaning',
      description: 'Hand-clean gutters and downspouts. Photo proof of clean.',
      default_rate_unit: 'per_job',
      sell_price_low: 100,
      sell_price_high: 250,
      scope_assumption: 'Standard 2-story home',
      typically_self_performed: false,
    },
    {
      key: 'window_gutter.combo',
      display_name: 'Window + Gutter Combo',
      description: 'Windows and gutters together. Most efficient.',
      default_rate_unit: 'per_job',
      sell_price_low: 150,
      sell_price_high: 350,
      scope_assumption: 'Standard 2-story home',
      typically_self_performed: false,
    },
  ],
};

export const HANDYMAN: ServiceCategory = {
  key: 'handyman_carpentry',
  display_name: 'Handyman / Carpentry',
  tagline: 'Repairs, installs, decks, trim & more',
  icon: 'handyman',
  brand_color: ONE_ROOF_BROWN,
  target_margin_low: 0.20,
  target_margin_high: 0.30,
  is_recurring: false,
  is_partnered: false,
  variants: [
    {
      key: 'handyman_carpentry.small_job',
      display_name: 'Small Job',
      description: 'Mounting, assembly, small repairs. Under 4 hours.',
      default_rate_unit: 'per_job',
      sell_price_low: 150,
      sell_price_high: 500,
      scope_assumption: 'Less than 4 hours of work, no major materials',
      typically_self_performed: true,
    },
    {
      key: 'handyman_carpentry.medium_job',
      display_name: 'Medium Job',
      description: 'Door installs, trim work, deck repairs. Up to 2 days.',
      default_rate_unit: 'per_job',
      sell_price_low: 500,
      sell_price_high: 2000,
      scope_assumption: '4 hours to 2 days, materials included',
      typically_self_performed: true,
    },
    {
      key: 'handyman_carpentry.large_job',
      display_name: 'Large Job / Skilled Work',
      description: 'Deck builds, custom carpentry, room remodels.',
      default_rate_unit: 'per_job',
      sell_price_low: 2000,
      sell_price_high: 10000,
      scope_assumption: 'Multi-day projects, custom estimate required',
      typically_self_performed: true,
    },
  ],
};

export const PEST_CONTROL: ServiceCategory = {
  key: 'pest_control',
  display_name: 'Pest Control',
  tagline: 'Monthly plans to keep pests away.',
  icon: 'pest_control',
  brand_color: ONE_ROOF_RED,
  target_margin_low: 0.15,
  target_margin_high: 0.30,
  is_recurring: true,
  default_interval: 'monthly',
  is_partnered: true,  // Phase 1: partner referral
  variants: [
    {
      key: 'pest_control.monthly_plan',
      display_name: 'Monthly Plan',
      description: 'Recurring monthly treatment. General pest prevention.',
      default_rate_unit: 'per_job',
      sell_price_low: 50,
      sell_price_high: 70,
      scope_assumption: 'Recurring monthly visits',
      typically_self_performed: false,
    },
    {
      key: 'pest_control.initial_treatment',
      display_name: 'Initial Treatment',
      description: 'First-visit deeper treatment. Begins recurring plan.',
      default_rate_unit: 'per_job',
      sell_price_low: 99,
      sell_price_high: 199,
      scope_assumption: 'One-time setup visit',
      typically_self_performed: false,
    },
  ],
};

// ============================================================================
// Catalog and helpers
// ============================================================================

export const PHASE_1_CATALOG: ServiceCategory[] = [
  PRESSURE_WASHING,
  LANDSCAPING,
  JUNK_REMOVAL,
  WINDOW_GUTTER,
  HANDYMAN,
  PEST_CONTROL,
];

/** Lookup a variant by its key. */
export function getVariant(key: string): ServiceVariant | undefined {
  for (const cat of PHASE_1_CATALOG) {
    const v = cat.variants.find(v => v.key === key);
    if (v) return v;
  }
  return undefined;
}

/** Lookup a category by its key. */
export function getCategory(key: string): ServiceCategory | undefined {
  return PHASE_1_CATALOG.find(c => c.key === key);
}

/** All variant keys (for validation, dropdowns). */
export function allVariantKeys(): string[] {
  return PHASE_1_CATALOG.flatMap(c => c.variants.map(v => v.key));
}

// ============================================================================
// Bundling intelligence
// ============================================================================
//
// Triggered in the quote builder when the operator adds a service.
// The platform suggests common bundles based on observed customer behavior.

export interface BundleSuggestion {
  /** Variant key being added that triggers the suggestion */
  trigger_key: string;
  /** Variant key suggested as a bundle add-on */
  suggest_key: string;
  /** Pitch text shown to the operator (and rephrased for the customer) */
  operator_pitch: string;
  /** Typical bundled discount (the cheat-sheet bundle pricing) */
  typical_bundle_savings_low: number;
  typical_bundle_savings_high: number;
}

export const BUNDLE_SUGGESTIONS: BundleSuggestion[] = [
  {
    trigger_key: 'pressure_washing.driveway',
    suggest_key: 'pressure_washing.house_wash',
    operator_pitch:
      'Customer requested driveway wash. Typical bundle adds house wash at +$100-$200 — total bundle $250-$500.',
    typical_bundle_savings_low: 50,
    typical_bundle_savings_high: 100,
  },
  {
    trigger_key: 'pressure_washing.house_wash',
    suggest_key: 'pressure_washing.driveway',
    operator_pitch:
      'Customer requested house wash. Most customers bundle the driveway too. Total bundle $250-$500.',
    typical_bundle_savings_low: 50,
    typical_bundle_savings_high: 100,
  },
  {
    trigger_key: 'window_gutter.windows',
    suggest_key: 'window_gutter.gutters',
    operator_pitch:
      'Customer requested window cleaning. Typical bundle adds gutters at +$100-$150 — total bundle $150-$350.',
    typical_bundle_savings_low: 50,
    typical_bundle_savings_high: 150,
  },
  {
    trigger_key: 'window_gutter.gutters',
    suggest_key: 'window_gutter.windows',
    operator_pitch:
      'Customer requested gutter cleaning. Most customers bundle window cleaning too. Total bundle $150-$350.',
    typical_bundle_savings_low: 50,
    typical_bundle_savings_high: 150,
  },
  {
    trigger_key: 'pressure_washing.bundle',
    suggest_key: 'window_gutter.combo',
    operator_pitch:
      'Pressure washing bundle paired with window/gutter combo is a 4-service ticket. Premium customers love this — total ticket can clear $700+.',
    typical_bundle_savings_low: 0,
    typical_bundle_savings_high: 0,
  },
  {
    trigger_key: 'landscaping_simple.cleanup',
    suggest_key: 'junk_removal.small_load',
    operator_pitch:
      'Yard cleanup customers often have other junk. Add small-load junk removal at +$75-$150.',
    typical_bundle_savings_low: 0,
    typical_bundle_savings_high: 25,
  },
];

/** Return all bundle suggestions for a given trigger key. */
export function bundleSuggestionsFor(triggerKey: string): BundleSuggestion[] {
  return BUNDLE_SUGGESTIONS.filter(s => s.trigger_key === triggerKey);
}

// ============================================================================
// Margin warning helper
// ============================================================================

export interface MarginWarning {
  category_key: string;
  computed_margin: number;
  target_margin_low: number;
  target_margin_high: number;
  level: 'info' | 'warning' | 'danger';
  message: string;
}

/**
 * Compute a margin warning for a given (sell, pay) pair against target margin band.
 * Used in the quote builder when the operator adjusts price or sub-pay below template.
 */
export function computeMarginWarning(
  categoryKey: string,
  sellPrice: number,
  subcontractorPay: number,
): MarginWarning | null {
  const cat = getCategory(categoryKey);
  if (!cat || sellPrice <= 0) return null;

  const margin = (sellPrice - subcontractorPay) / sellPrice;

  if (margin >= cat.target_margin_low) return null;  // healthy

  const shortfall = cat.target_margin_low - margin;
  const level: MarginWarning['level'] =
    shortfall > 0.10 ? 'danger' :
    shortfall > 0.05 ? 'warning' : 'info';

  return {
    category_key: categoryKey,
    computed_margin: margin,
    target_margin_low: cat.target_margin_low,
    target_margin_high: cat.target_margin_high,
    level,
    message:
      `Margin ${(margin * 100).toFixed(1)}% is below target ${(cat.target_margin_low * 100).toFixed(0)}-` +
      `${(cat.target_margin_high * 100).toFixed(0)}% for ${cat.display_name}. ` +
      (level === 'danger'
        ? 'Consider raising sell price or renegotiating sub pay.'
        : 'Acceptable for relationship-building or volume pricing — but watch the trend.'),
  };
}

// ============================================================================
// Pricing Cheat Sheet (operator console view)
// ============================================================================

export interface CheatSheetRow {
  category: ServiceCategory;
  variant: ServiceVariant;
  formatted_price: string;
}

export function buildCheatSheet(): CheatSheetRow[] {
  return PHASE_1_CATALOG.flatMap(cat =>
    cat.variants.map(v => ({
      category: cat,
      variant: v,
      formatted_price:
        v.default_rate_unit === 'per_sqft'
          ? `$${v.sell_price_low.toFixed(2)} - $${v.sell_price_high.toFixed(2)}/sqft`
          : `$${v.sell_price_low} - $${v.sell_price_high}`,
    })),
  );
}
