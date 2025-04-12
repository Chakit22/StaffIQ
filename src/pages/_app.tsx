import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserProvider";
import { CourseProvider } from "@/context/CourseProvider";
import { RankingProvider } from "@/context/RankingProvider";
import { ApplicantProvider } from "@/context/ApplicantProvider"; 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApplicantProvider> 
      <RankingProvider> 
        <UserProvider> 
          <CourseProvider> 
            <Toaster position="top-right" /> {/*Toast notifications*/}
            <Component {...pageProps} /> {/*Main component render*/}
          </CourseProvider>
        </UserProvider>
      </RankingProvider>
    </ApplicantProvider>
  );
}
