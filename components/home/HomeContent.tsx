// components/home/HomeContent.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import HeroSlider from "@/components/landingPages/HeroSlider";

export default function HomeContent() {

  const slides = [
    { id: 1, image: "/slider/slider1.jpg", buttonText: "Sign Up Now", buttonLink: "/products" },
    { id: 2, image: "/slider/slider2.jpg", buttonText: "Sign Up Now", buttonLink: "/products" },
    { id: 3, image: "/slider/slider3.jpg", buttonText: "Sign Up Now", buttonLink: "/products" },
    { id: 4, image: "/slider/slider4.jpg", buttonText: "Sign Up Now", buttonLink: "/products" },
    { id: 5, image: "/slider/slider5.jpg", buttonText: "Sign Up Now", buttonLink: "/products" },
    { id: 6, image: "/slider/slider6.jpg", buttonText: "Sign Up Now", buttonLink: "/products" },
    { id: 7, image: "/slider/slider7.jpg", buttonText: "Sign Up Now", buttonLink: "/products" },
    { id: 8, image: "/slider/slider8.jpg", buttonText: "Sign Up Now", buttonLink: "/products" },
    { id: 9, image: "/slider/slider9.jpg", buttonText: "Sign Up Now", buttonLink: "/products" },
  ];

  return (
    <>
     
      {/* HERO SLIDER */}
      <HeroSlider slides={slides} />

      {/* HERO SECTION */}
      <section className="pt-28 bg-app">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-primary">
              Planovae <br />
              <span className="text-accent-default">
                The Event Planner's Ultimate Assistant
              </span>
            </h1>
            <p className="mt-4 text-secondary max-w-md">
              Manage weddings, corporate events, and private parties seamlessly in one
              event-centric platform. Replace scattered tools with a single solution.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="/services"
                className="bg-[#F59E0B] text-inverse px-6 py-3 rounded-full shadow hover:bg-[#D97706] transition transform hover:scale-105"
              >
                Explore Now
              </a>
              <a
                href="#about"
                className="border border-border px-6 py-3 rounded-full hover:bg-card transition transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Image
              src="/landing/img-1.jpg"
              alt="Event Planning"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-background-main">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Image
              src="/landing/img-2.jpg"
              alt="About Planovae"
              width={500}
              height={350}
              className="rounded-xl shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-[#F59E0B] font-semibold">About Planovae</h3>
            <h2 className="text-3xl font-bold mt-2 text-primary">
              Event Planning Made Simple
            </h2>
            <p className="mt-4 text-secondary">
              Planovae is a vertical SaaS platform built specifically for professional
              event planners. Manage timelines, budgets, vendors, and clients all
              within one event-first system.
            </p>

            <a
              href="/about"
              className="mt-6 inline-block bg-[#4F46E5] text-white px-6 py-3 rounded-full shadow hover:bg-[#4338CA] transition transform hover:scale-105"
            >
              Read More
            </a>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-[#F3F4F6] text-[#111827]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-[#F59E0B] font-semibold">Our Services</h3>
          <h2 className="text-3xl font-bold mt-2">
            Streamlined Event Management
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Wedding Planning",
              "Corporate Events",
              "Vendor Management",
              "Client Portal",
            ].map((service, i) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#FFFFFF] text-[#111827] p-6 rounded-xl shadow hover:scale-105 transition"
              >
                <h4 className="font-semibold">{service}</h4>
                <p className="text-muted text-sm mt-2">
                  Designed to simplify your event planning process with ease.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS SECTION */}
      <section className="py-20 bg-app">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "Event-Centric Workflow",
              desc: "Focus on each event with timelines, tasks, vendors, and budgets in one place.",
            },
            {
              title: "Real-Time Collaboration",
              desc: "Assign tasks, track progress, and collaborate with your team seamlessly.",
            },
            {
              title: "Client Access Portal",
              desc: "Share event timelines and budget summaries securely with your clients.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#FFFFFF] p-8 rounded-xl shadow hover:shadow-lg transition"
            >
              <h4 className="text-[#F59E0B] font-semibold text-lg">
                {feature.title}
              </h4>
              <p className="mt-4 text-[#374151]">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-20 bg-footer text-[#374151] text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold"
        >
          Ready to Plan Your Next Event?
        </motion.h2>

        <a
          href="/auth/signup"
          className="mt-6 inline-block bg-[#F59E0B] text-[#FFFFFF] px-8 py-3 rounded-full font-semibold hover:bg-[#D97706] transition transform hover:scale-105"
        >
          Get Started
        </a>
      </section>
    </>
  );
}
