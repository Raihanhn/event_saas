//components/signupForms/StepThreePlan.tsx
"use client";

import { motion } from "framer-motion";
import { SignupFormData } from "./types";

interface Props {
  form: SignupFormData;
  update: (key: keyof SignupFormData, value: any) => void;
  validateRef: React.MutableRefObject<() => boolean>;
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    subtitle: "For getting started",
    features: [
      "1 active event",
      "Basic task & timeline",
      "Vendor management",
      "Client read-only link",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$29 / mo",
    highlight: true,
    subtitle: "For freelancers",
    features: [
      "Up to 10 active events",
      "Advanced timeline & calendar",
      "Budget tracking",
      "Team members (up to 5)",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    price: "$79 / mo",
    subtitle: "For agencies",
    features: [
      "Up to 30 active events",
      "Unlimited vendors",
      "Advanced analytics",
      "White-label client portal",
    ],
  },
];

export default function StepThreePlan({
  form,
  update,
  validateRef,
}: Props) {
  const validate = () => {
    if (!form.plan) {
      alert("Please select a plan");
      return false;
    }
    return true;
  };

  validateRef.current = validate;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6 text-[#111827]">
        Choose your pricing plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isActive = form.plan === plan.id;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6 }}
              onClick={() => update("plan", plan.id)}
              className={`relative cursor-pointer rounded-2xl p-6 border transition-all duration-300
                ${
                  isActive
                    ? "bg-[#4F46E5] text-white border-[#4F46E5] scale-105"
                    : "bg-[#FFFFFF] border-[#E5E7EB] hover:shadow-xl"
                }`}
            >
              {/* Highlight badge */}
              {plan.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p
                className={`text-sm mt-1 ${
                  isActive ? "text-[#E5E7EB]" : "text-[#6B7280]"
                }`}
              >
                {plan.subtitle}
              </p>

              <p className="text-4xl font-extrabold mt-6">{plan.price}</p>

              <ul className="mt-6 space-y-2 text-sm">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        isActive ? "text-white" : "text-[#4F46E5]"
                      }`}
                    >
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl ring-2 ring-white/40 pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
