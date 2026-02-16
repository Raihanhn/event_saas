//components/services/ServicesContent.tsx
"use client";

import { motion, Variants } from "framer-motion";

const services = [
  {
    title: "Wedding Planning",
    text: `From engagement to reception, manage every detail around one perfect date. 
    Coordinate vendors, timeline, and budgets effortlessly. 
    Track tasks for each wedding phase. 
    Share read-only links with clients. 
    Ensure everything runs smoothly on the big day.`,
    image: "/services/marriage-event.jpg",
    color: "#4F46E5",
  },
  {
    title: "Corporate Events",
    text: `Plan product launches, conferences, and annual meetings with precision. 
    Assign tasks to team members. 
    Track vendors and budgets. 
    Keep all deadlines aligned with your calendar. 
    Deliver a professional event experience every time.`,
    image: "/services/corporate-event.jpg",
    color: "#F59E0B",
  },
  {
    title: "Private Events",
    text: `Make small gatherings and private parties stress-free. 
    Manage guest lists and timelines efficiently. 
    Track your budget and vendor assignments. 
    Upload and share important files. 
    Create memorable experiences for your guests.`,
    image: "/services/private-event.jpg",
    color: "#4F46E5",
  },
  {
    title: "Birthday Parties",
    text: `Celebrate birthdays with perfectly coordinated events. 
    Plan timelines, decorations, and catering. 
    Track vendors and budget effortlessly. 
    Share event details with family and friends. 
    Ensure the birthday is fun and memorable.`,
    image: "/services/birthday-event.jpg",
    color: "#F59E0B",
  },
  {
    title: "Product Launches",
    text: `Execute product launches flawlessly. 
    Align marketing, logistics, and timelines. 
    Coordinate multiple teams and vendors. 
    Track budgets and tasks for every milestone. 
    Make your product debut a success.`,
    image: "/services/product-launch-event.jpg",
    color: "#4F46E5",
  },
  {
    title: "Conferences & Meetings",
    text: `Organize corporate meetings, seminars, and workshops. 
    Assign and track tasks efficiently. 
    Monitor vendor assignments and budget. 
    Keep all timelines clear and organized. 
    Ensure smooth execution for a professional experience.`,
    image: "/services/conference-event.jpg",
    color: "#F59E0B",
  },
];

// Slight animation variants
const imageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  },
};

export default function ServicesContent() {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 space-y-20 md:space-y-32">
      {services.map((s, i) => {
        const isEven = i % 2 === 0;

        return (
          <motion.div
            key={s.title}
            className={`flex flex-col md:flex-row gap-8 md:gap-12 items-center ${
              !isEven ? "md:flex-row-reverse" : ""
            }`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Image */}
            <motion.img
              src={s.image}
              alt={s.title}
              className="rounded-2xl shadow-lg w-full md:w-1/2 object-cover"
              variants={imageVariants}
            />

            {/* Text */}
            <motion.div
              variants={textVariants}
              className="space-y-4 md:space-y-6 w-full md:w-1/2"
            >
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold"
                style={{ color: s.color }}
              >
                {s.title}
              </h2>
              <p className="text-gray-600 text-base md:text-lg lg:text-lg whitespace-pre-line">
                {s.text}
              </p>
            </motion.div>
          </motion.div>
        );
      })}
    </section>
  );
}
