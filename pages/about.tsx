// pages/about.tsx
import LandingLayout from "@/components/layouts/LandingLayout";
import PageTransition from "@/components/transitions/PageTransition";
import AboutContent from "@/components/about/AboutContent";

export default function AboutPage() {
  return (
    <LandingLayout>
      <PageTransition>
        <AboutContent />
      </PageTransition>
    </LandingLayout>
  );
}
