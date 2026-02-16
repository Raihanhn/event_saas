// pages/auth/signup.tsx

import LandingLayout from "@/components/layouts/LandingLayout";
import PageTransition from "@/components/transitions/PageTransition";
import SignupContent from "@/components/auth/SignUpContent";

export default function SignUpPage() {
  return (
    <LandingLayout>
      <PageTransition>
        <SignupContent/>
      </PageTransition>
    </LandingLayout>
  );
}
