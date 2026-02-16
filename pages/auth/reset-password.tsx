//pages/auth/reset-password.tsx

import LandingLayout from "@/components/layouts/LandingLayout";
import PageTransition from "@/components/transitions/PageTransition";
import ResetPasswordContent from "@/components/auth/ResetPasswordContent";

export default function ResetPassword() {
  return (
    <LandingLayout>
      <PageTransition>
        <ResetPasswordContent/>
      </PageTransition>
    </LandingLayout>
  );
}

