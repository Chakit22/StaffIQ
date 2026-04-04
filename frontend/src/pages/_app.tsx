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
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#1a1a2e",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              color: "#e2e8f0",
              borderRadius: "12px",
              backdropFilter: "blur(12px)",
            },
          }}
        />
        <SidebarProvider>
          <Component {...pageProps} />
        </SidebarProvider>
      </NuqsAdapter>
    </UserProvider>
  );
}
