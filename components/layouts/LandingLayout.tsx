// components/layouts/LandingLayout.tsx

import { ReactNode } from "react";
import LandingHeader from "@/components/landingPages/LandingHeader";
import Footer from "../Footer";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LandingHeader />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
