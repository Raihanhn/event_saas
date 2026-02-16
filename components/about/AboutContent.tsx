"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";


const fadeText: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeBlock: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutPage() {

  return (
    <>
      <section
        className="pt-28 pb-20 md:pt-32 md:pb-28 text-center px-4"
        style={{ backgroundColor: "#F9FAFB" }}
      >
        <motion.h1
          variants={fadeText}
          initial="hidden"
          animate="visible"
          className="text-3xl md:text-5xl font-bold"
          style={{ color: "#111827" }}
        >
          Built for Modern Event Planners
        </motion.h1>

        <motion.p
          variants={fadeText}
          initial="hidden"
          animate="visible"
          className="mt-6 max-w-4xl mx-auto text-base md:text-xl leading-relaxed"
          style={{ color: "#374151" }}
        >
          Planovae is a vertical SaaS platform designed to replace spreadsheets,
          WhatsApp threads, and disconnected tools with a single, structured system.
          Everything revolves around one thing that matters most — the event date.
          From early planning to execution day, Planovae keeps every detail visible,
          organized, and under control.
        </motion.p>
      </section>

      {/* ================= MISSION ================= */}
      <section className="py-20 px-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeBlock}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Image
              src="/landing/mission.jpg"
              alt="Our Mission"
              width={640}
              height={420}
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </motion.div>

          <motion.div
            variants={fadeText}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3
              className="font-semibold mb-2"
              style={{ color: "#F59E0B" }}
            >
              Our Mission
            </h3>

            <h2
              className="text-2xl md:text-4xl font-bold mb-6"
              style={{ color: "#111827" }}
            >
              Bring clarity to complex event planning
            </h2>

            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "#374151" }}
            >
              Event planning is high-pressure by nature. Deadlines, vendors, budgets,
              and clients all move at once. Our mission is to give planners a calm,
              reliable workspace where nothing falls through the cracks. Planovae
              centralizes tasks, timelines, files, budgets, and communication so teams
              can work confidently instead of reacting to chaos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= VISION ================= */}
      <section className="py-20 px-4" style={{ backgroundColor: "#F9FAFB" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeText}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <h3
              className="font-semibold mb-2"
              style={{ color: "#F59E0B" }}
            >
              Our Vision
            </h3>

            <h2
              className="text-2xl md:text-4xl font-bold mb-6"
              style={{ color: "#111827" }}
            >
              A future where planners focus on creativity
            </h2>

            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "#374151" }}
            >
              We believe event planners should spend more time designing unforgettable
              experiences and less time chasing updates. Our vision is to become the
              operating system for professional planners — a platform that adapts to
              different event types while keeping workflows structured, transparent,
              and scalable.
            </p>
          </motion.div>

          <motion.div
            variants={fadeBlock}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <Image
              src="/landing/vision.jpg"
              alt="Our Vision"
              width={640}
              height={420}
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-20 px-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            variants={fadeText}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-bold mb-12"
            style={{ color: "#111827" }}
          >
            What We Stand For
          </motion.h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
            {[
              {
                title: "Innovation",
                desc:
                  "We continuously refine workflows and features to match how real planners actually work.",
              },
              {
                title: "Reliability",
                desc:
                  "Deadlines matter. Our platform is built to be dependable when events are on the line.",
              },
              {
                title: "Transparency",
                desc:
                  "Clear visibility for teams and clients builds trust and prevents last-minute surprises.",
              },
              {
                title: "Creativity",
                desc:
                  "Structure should empower creativity, not limit it. Planovae creates space to design.",
              },
            ].map((v) => (
              <motion.div
                key={v.title}
                variants={fadeText}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-6 rounded-2xl shadow-sm"
                style={{ backgroundColor: "#F3F4F6" }}
              >
                <h4
                  className="font-semibold text-lg mb-2"
                  style={{ color: "#4F46E5" }}
                >
                  {v.title}
                </h4>
                <p style={{ color: "#374151" }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section
        className="py-24 text-center px-4"
        style={{ backgroundColor: "#111827", color: "#FFFFFF" }}
      >
        <motion.h2
          variants={fadeText}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-bold"
        >
          Ready to plan events with confidence?
        </motion.h2>

        <motion.p
          variants={fadeText}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-6 max-w-3xl mx-auto text-base md:text-lg"
          style={{ color: "#D1D5DB" }}
        >
          Join professional planners who are moving away from chaos and into a
          structured, event-first workflow with Planovae.
        </motion.p>

        <a
          href="/auth/signup"
          className="inline-block mt-10 px-10 py-4 rounded-full font-semibold transition"
          style={{
            backgroundColor: "#4F46E5",
            color: "#FFFFFF",
          }}
        >
          Get Started
        </a>
      </section>
      </>
  );
}
