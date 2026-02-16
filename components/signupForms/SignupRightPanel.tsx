// components/forms/signup/SignupRightPanel.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

interface Props {
  step: number;
}

const stepContent = {
  1: {
    title: "Welcome to Planovae",
    description:
      "Start by creating your account to manage events, budgets, and clients with ease.",
    image: "/sign/form-1.jpg",
  },
  2: {
    title: "Tell us about your business",
    description:
      "Provide details about your agency or business to tailor the platform to your needs.",
    image: "/sign/form-2.jpg",
  },
};

export default function SignupRightPanel({ step }: Props) {
  const current = stepContent[step as keyof typeof stepContent];

  // 🔹 Preload next step image for instant transition
  useEffect(() => {
    const nextStep = step + 1;
    const nextImage = stepContent[nextStep as keyof typeof stepContent]?.image;

    if (nextImage) {
      const img = new window.Image();
      img.src = nextImage;
    }
  }, [step]);

  if (!current) return null;

  return (
    <div className="relative md:w-1/2 rounded-2xl overflow-hidden hidden md:flex">
      {/* ✅ SINGLE optimized image */}
      <Image
        src={current.image}
        alt={current.title}
        fill
        priority
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* Text animation */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-20 p-10 flex flex-col justify-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {current.title}
          </h2>
          <p className="text-gray-200 max-w-md">
            {current.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
