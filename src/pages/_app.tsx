import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserProvider";
import { CourseProvider } from "@/context/CourseProvider";
import { ApplicantProvider } from "@/context/ApplicantProvider";
import { NuqsAdapter } from "nuqs/adapters/next/pages";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApplicantProvider>
      <UserProvider>
        <CourseProvider>
          <NuqsAdapter>
            <Toaster position="top-right" /> {/*Toast notifications*/}
            <Component {...pageProps} /> {/*Main component render*/}
          </NuqsAdapter>
        </CourseProvider>
      </UserProvider>
    </ApplicantProvider>
  );
}
