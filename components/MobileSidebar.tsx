// components/layouts/MobileSidebar.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  menuItems: { name: string; href: string; icon: any }[];
}

export default function MobileSidebar({ open, onClose, menuItems }: MobileSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed z-50 top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl p-4 flex flex-col"
          >
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <button onClick={onClose} className="text-gray-700 dark:text-gray-300">
                <FaTimes size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      <Icon size={20} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
