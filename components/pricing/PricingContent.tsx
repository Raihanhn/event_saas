"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    subtitle: "For getting started",
    features: [
      "1 active event",
      "Basic task & timeline",
      "Vendor management",
      "5MB file uploads",
      "Client read-only link",
    ],
  },
  {
    name: "Growth",
    price: "$29 / mo",
    highlight: true,
    subtitle: "For freelancers",
    features: [
      "Up to 10 active events",
      "Advanced timeline & calendar",
      "Budget tracking (planned vs actual)",
      "1GB file uploads",
      "Team members (up to 5)",
      "Email notifications",
    ],
  },
  {
    name: "Studio",
    price: "$79 / mo",
    subtitle: "For agencies",
    features: [
      "Up to 30 active events",
      "Unlimited vendors",
      "Advanced analytics",
      "White-label client portal",
      "Priority support",
      "Unlimited file uploads",
    ],
  },
];

export default function PricingContent() {
  return (
    <section className="pt-32 pb-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center py-5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Simple, Event-Based Pricing
        </motion.h1>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Pay based on how many events you manage — not users, not features.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-2xl border shadow-xl transition-all duration-300 ${
                plan.highlight
                  ? "bg-[#4F46E5] text-white scale-105"
                  : "bg-white hover:shadow-2xl"
              }`}
            >
              {/* Badge */}
              {plan.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              {/* Header */}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-sm opacity-80 mt-1">{plan.subtitle}</p>

              <p className="text-4xl font-extrabold mt-6">{plan.price}</p>

              {/* Features */}
              <ul className="mt-8 space-y-3 text-sm flex-1 mb-5 ">
                {plan.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center gap-3 cursor-default group"
                  >
                    <motion.span
                      className={`font-bold ${
                        plan.highlight ? "text-white" : "text-[#4338CA]"
                      }`}
                      whileHover={{ scale: 1.2 }}
                    >
                      ✓
                    </motion.span>

                    <span className="transition-colors duration-200 group-hover:text-[#0a0918]">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Button — ALWAYS aligned */}
              <Link href="/auth/signup">
              <button
                className={`mt-auto w-full py-3 rounded-full  transition transform hover:scale-105
                    font-semibold cursor-pointer ${
                      plan.highlight
                        ? "bg-white text-[#4F46E5]  "
                        : "bg-[#4F46E5] text-white hover:[#4338CA]"
                    }`}
              >
                Get Started
              </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
