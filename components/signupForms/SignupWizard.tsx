//components/signupForms/SignupWizard.tsx
"use client";

import axios from "axios";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import SignupRightPanel from "./SignupRightPanel";
import { signupInitialState } from "./initialState";
import { SignupFormData } from "./types";

// Dynamic imports for better performance
const StepOneAccount = dynamic(() => import("./StepOneAccount"));
const StepTwoBusiness = dynamic(() => import("./StepTwoBusiness"), { ssr: false });
const StepThreePlan = dynamic(() => import("./StepThreePlan"), { ssr: false });

export default function SignupWizard() {
  const [step, setStep] = useState(1);
  const [loadingText, setLoadingText] = useState<string | null>(null);
  const [form, setForm] = useState<SignupFormData>(signupInitialState);
  const [userId, setUserId] = useState<string | null>(null);

  const step1Ref = useRef<() => boolean>(() => true);
  const step2Ref = useRef<() => boolean>(() => true);
  const step3Ref = useRef<() => boolean>(() => true);

  const router = useRouter();

  const updateForm = (key: keyof SignupFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = async () => {
    let isValid = true;
    if (step === 1) isValid = step1Ref.current();
    if (step === 2) isValid = step2Ref.current();
    if (!isValid) return;

    // Step 2: Create account if not already created
    if (step === 2 && !userId) {
      try {
        setLoadingText("Creating your account...");
        const res = await axios.post("/api/auth/signup", form);

        if (res.status !== 201) throw new Error(res.data.message || "Signup failed");

        setUserId(res.data.user?.id || null);
        setLoadingText(null);
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.message || err.message || "Failed to create account");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleFinish = async () => {
    if (!step3Ref.current()) return;
    if (!userId) return alert("User account not created yet");

    try {
      setLoadingText("Redirecting...");

      // Free plan → dashboard
      if (form.plan === "free") {
        router.push("/dashboard");
        return;
      }

      // Paid plan → Stripe checkout
      const stripeRes = await axios.post("/api/stripe/checkout", { plan: form.plan });

      if (stripeRes.data?.url) {
        setLoadingText("Redirecting to Stripe...");
        window.location.href = stripeRes.data.url;
      } else {
        throw new Error("Unable to start Stripe checkout");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Server error");
    } finally {
      setLoadingText(null);
    }
  };

  return (
    <div className={`mx-auto w-full transition-all duration-500 ${step === 3 ? "max-w-[90vw]" : "max-w-5xl"}`}>
      <div className={`flex rounded-2xl overflow-hidden gap-6 ${step === 3 ? "flex-col" : "flex-col md:flex-row"}`}>
        {step !== 3 && <SignupRightPanel step={step} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`bg-white p-10 rounded-2xl shadow-md w-full ${step === 3 ? "md:w-full" : "md:w-1/2"}`}
          >
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                {step === 1 && "Account Creation"}
                {step === 2 && "Business Information"}
                {step === 3 && "Choose the plan that fits your business"}
              </h2>
            </div>

            {/* STEPS */}
            {step === 1 && <StepOneAccount form={form} update={updateForm} validateRef={step1Ref} />}
            {step === 2 && <StepTwoBusiness form={form} update={updateForm} validateRef={step2Ref} />}
            {step === 3 && <StepThreePlan form={form} update={updateForm} validateRef={step3Ref} />}

            {/* ACTIONS */}
            <div className="flex items-center mt-8">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition transform hover:scale-105 cursor-pointer"
                >
                  Back
                </button>
              )}

              {step < 3 && (
                <button
                  onClick={nextStep}
                  disabled={!!loadingText}
                  className="ml-auto px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition transform hover:scale-105 cursor-pointer"
                >
                  {step === 2 && loadingText ? loadingText : "Next"}
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={handleFinish}
                  disabled={!!loadingText}
                  className="ml-auto px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition transform hover:scale-105 cursor-pointer"
                >
                  {loadingText || "Finish & Continue"}
                </button>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <a
                  href="/auth/signin"
                  className="font-medium text-indigo-600 hover:text-indigo-700 transition transform hover:scale-105 cursor-pointer"
                >
                  Log in
                </a>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

