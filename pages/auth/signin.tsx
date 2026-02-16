// pages/auth/signin.tsx

import LandingLayout from "@/components/layouts/LandingLayout";
import PageTransition from "@/components/transitions/PageTransition";
import SigninContent from "@/components/auth/SigninContent";
import Head from "next/head";

export default function SigninPage() {
  return (
    <>

       <Head>
        <link rel="preload" href="/sign/signin.jpg" as="image" />
      </Head>

    <LandingLayout>
      <PageTransition>
        <SigninContent />
      </PageTransition>
    </LandingLayout>
    </>
  );
}
