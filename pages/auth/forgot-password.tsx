//pages/auth/forgot-password.tsx

import LandingLayout from "@/components/layouts/LandingLayout";
import PageTransition from "@/components/transitions/PageTransition";
import ForgotPasswordContent from "@/components/auth/ForgotPasswordContent";

export default function ForgotPassword() {
  return (
    <LandingLayout>
      <PageTransition>
        <ForgotPasswordContent/>
      </PageTransition>
    </LandingLayout>
  );
}

