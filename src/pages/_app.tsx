import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/pages";

export default function App({ Component, pageProps }: AppProps) {
  // console.log("pageProps", pageProps);
  return (
    <NuqsAdapter>
      <Toaster position="top-right" /> {/*Toast notifications*/}
      <Component {...pageProps} />
    </NuqsAdapter>
  );
}
