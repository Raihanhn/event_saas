//pages/services.tsx

import LandingLayout from "@/components/layouts/LandingLayout";
import PageTransition from "@/components/transitions/PageTransition";
import ServicesContent from "@/components/services/ServicesContent";

export default function ServicesPage() {
  return (
    <LandingLayout>
      <PageTransition>
        <ServicesContent />
      </PageTransition>
    </LandingLayout>
  );
}
