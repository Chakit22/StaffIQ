import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserProvider";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <NuqsAdapter>
        <Toaster position="top-right" /> {/*Toast notifications*/}
        <SidebarProvider>
          <Component {...pageProps} />
        </SidebarProvider>
      </NuqsAdapter>
    </UserProvider>
  );
}
