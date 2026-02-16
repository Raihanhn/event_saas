"use client";
import React from "react";
import { FaXTwitter, FaFacebookF } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="bg-[#0B1220] text-gray-400">
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Logo Section */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-3">Planovae</h2>
          <p className="text-sm max-w-sm">
            Building modern experiences for startups and businesses with
            scalable and elegant UI solutions.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
          <ul className="space-y-3 text-sm">
            <li>Features</li>
            <li>Pricing</li>
            <li>Documentation</li>
            <li>API</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
          <ul className="space-y-3 text-sm">
            <li>About</li>
            <li>Blog</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookies Policy</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left */}
          <div className="text-sm text-left w-full md:w-auto">
            © {new Date().getFullYear()} Planovae. All rights reserved.
          </div>

          {/* Center */}
          <div className="text-sm w-full md:w-auto flex flex-wrap justify-center gap-4">
            <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
            <span className="hidden md:inline">|</span>
            <a href="/terms" className="hover:text-white transition">Terms of Service</a>
          </div>

          {/* Right - Social Icons */}
          <div className="flex gap-4 w-full md:w-auto justify-center md:justify-end">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <FaFacebookF size={20}/>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <FaXTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <IoLogoInstagram size={20} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
