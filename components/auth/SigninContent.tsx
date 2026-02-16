// components/auth/SigninContent.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function SigninContent() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Submitting login for:", email); // ✅ log email

    try {
      const res = await axios.post(
        "/api/auth/signin",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      setUser(res.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background image */}

      <div className="absolute inset-0 ">
        <Image
          src="/sign/signin.jpg"
          alt="Signin background"
          fill
          priority
          className="object-cover scale-105"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.25), rgba(15,23,42,0.45))",
        }}
      />

      {/* Glass container */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 gap-5 md:grid-cols-2 rounded-2xl overflow-hidden">
        {/* Left content */}
        <div
          className="p-10 flex flex-col justify-center rounded-2xl "
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 40px 90px rgba(0,0,0,0.35)",
          }}
        >
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
            Welcome back to Planovae
          </h1>

          <p className="mb-6" style={{ color: "#E5E7EB" }}>
            Sign in to manage your events, timelines, vendors, and budgets — all
            centered around what matters most: your event date.
          </p>

          <p className="text-sm" style={{ color: "#D1D5DB" }}>
            One workspace. One timeline. Every detail in sync.
          </p>
        </div>

        {/* Right form */}
        <div
          className="p-10 rounded-2xl "
          style={{
            background: "#ffffff",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <h2
            className="text-xl font-semibold mb-6 "
            style={{ color: "#111827" }}
          >
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 rounded-lg outline-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.8)",
                border: "1px solid #E5E7EB",
                color: "#111827",
              }}
            />

            {/* Password with eye toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-lg outline-none pr-12"
                style={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  border: "1px solid #E5E7EB",
                  color: "#111827",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer "
                style={{ color: "#6B7280" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium transition transform hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: "#4F46E5",
                color: "#FFFFFF",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Links */}
          <div
            className="mt-6 flex items-center justify-between text-sm"
            style={{ color: "#374151" }}
          >
            <Link href="/forgot-password" style={{ color: "#4F46E5" }}>
              Forgot password?
            </Link>

            <Link
              href="/auth/signup"
              style={{ color: "#4F46E5", fontWeight: 500 }}
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
