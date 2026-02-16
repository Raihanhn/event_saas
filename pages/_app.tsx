// planovae/pages/_app.tsx

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = router.pathname;

  return (
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
  );
}
