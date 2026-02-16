// pages/index.tsx

import LandingLayout from "@/components/layouts/LandingLayout";
import PageTransition from "@/components/transitions/PageTransition";
import HomeContent from "@/components/home/HomeContent";

export default function LandingPage() {
  return (
    <LandingLayout>
      <PageTransition>
        <HomeContent />
      </PageTransition>
    </LandingLayout>
  );
}
