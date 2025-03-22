import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/UserProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
