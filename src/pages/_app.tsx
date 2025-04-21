import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserProvider";
import { CourseProvider } from "@/context/CourseProvider";
import { ApplicantProvider } from "@/context/ApplicantProvider";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import { LoadingProvider } from "@/context/LoadingProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LoadingProvider>
      <ApplicantProvider>
        <UserProvider>
          <CourseProvider>
            <NuqsAdapter>
              <Toaster position="top-right" /> {/*Toast notifications*/}
              <Component {...pageProps} /> Main component render
            </NuqsAdapter>
          </CourseProvider>
        </UserProvider>
      </ApplicantProvider>
    </LoadingProvider>
  );
}
