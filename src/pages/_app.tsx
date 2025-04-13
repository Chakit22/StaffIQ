import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/UserProvider";
import { CourseProvider } from "@/context/CourseProvider";
import { RankingProvider } from "@/context/RankingProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CourseProvider>
        <Toaster position="top-right" />
        <Component {...pageProps} />
      </CourseProvider>
    </AuthProvider>
  );
}
