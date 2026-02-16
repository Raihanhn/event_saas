// pages/pricing.tsx
import LandingLayout from "@/components/layouts/LandingLayout";
import PageTransition from "@/components/transitions/PageTransition";
import PricingContent from "@/components/pricing/PricingContent";

export default function PricingPage() {
  return (
    <LandingLayout>
      <PageTransition>
        <PricingContent />
      </PageTransition>
    </LandingLayout>
  );
}
