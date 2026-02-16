// components/auth/SignUpContent.tsx
"use client";

import SignupWizard from "@/components/signupForms/SignupWizard";
import Image from "next/image";

export default function SignupContent() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Full-screen background image */}
      <Image
        src="/sign/signup.jpg"
        alt="Signup background"
        fill
        priority
        sizes="100vw"
        className="object-cover scale-105"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.25), rgba(15,23,42,0.45))",
        }}
      />

      <div className="relative w-full flex justify-center mb-5 items-start md:items-center mt-10 md:mt-20 lg:mt-28">
        <SignupWizard />
      </div>
    </div>
  );
}
