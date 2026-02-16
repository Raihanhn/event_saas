// components/landingPages/LandingHeader.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Signin", href: "/auth/signin" },
];

export default function LandingHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className=" animate-fade-in-down flex items-center justify-between
            bg-white/60 backdrop-blur-xl
            border border-gray-200
            rounded-full px-6 md:px-8 py-3 md:py-4 shadow-lg"
        >
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-[#4F46E5]">
            Planovae
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href;

              return (
                <div
                  key={item.href}
                  className="transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <Link
                    href={item.href}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors 
                      ${
                        isActive
                          ? "bg-[#EEF2FF] text-[#4F46E5]"
                          : "text-gray-700 hover:bg-gray-100 hover:text-[#4F46E5]"
                      }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <div className="transition-transform duration-200 hover:scale-105">
              <Link
                href="/auth/signup"
                className="bg-[#4F46E5] text-white px-6 py-2.5 rounded-full text-sm shadow-md hover:bg-[#4338CA] transition"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-[#4F46E5] hover:bg-gray-100 transition"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl mx-4 mt-2 shadow-lg
    overflow-hidden transition-[max-height,opacity] duration-300 ease-out
    ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
  `}
      >
        <div className="flex flex-col px-4 py-4 gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-colors
            ${
              isActive
                ? "bg-[#EEF2FF] text-[#4F46E5]"
                : "text-gray-700 hover:bg-gray-100 hover:text-[#4F46E5]"
            }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/auth/signup"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-[#4F46E5] text-white px-6 py-2 rounded-full text-base shadow-md hover:bg-[#4338CA]
        transition-transform duration-200 hover:scale-105 mt-2 text-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
