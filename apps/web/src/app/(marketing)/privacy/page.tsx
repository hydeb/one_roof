import { ComingSoon } from '@/components/coming-soon';

export default function PrivacyPage() {
  return (
    <ComingSoon
      title="Privacy policy"
      phase="Pre-launch"
      blurb="Full policy lands before public beta. Highlights: we minimize PII, do not sell personal data, support CCPA/CPRA-aligned export and deletion, and use vendor-held identity (Stripe Identity, Checkr) wherever possible."
    />
  );
}
