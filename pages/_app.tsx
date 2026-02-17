// planovae/pages/_app.tsx

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";

// Configure Inter
const inter = Inter({
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800","900"], // include weights you use
  display: "swap", // ensures text renders immediately for better LCP
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = router.pathname;

  return (
     <main className={inter.className}>
    <AuthProvider initialUser={pageProps.user ?? null} >
       <ThemeProvider>
       <Toaster position="top-center" />
      {pathname.startsWith("/dashboard") ? (
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      ) : (
        <Component {...pageProps} />
      )}
      </ThemeProvider>
    </AuthProvider>
    </main>
  );
}
