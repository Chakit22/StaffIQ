import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserProvider";
import { NuqsAdapter } from "nuqs/adapters/next/pages";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <UserProvider>
      <NuqsAdapter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a2e",
              border: "1px solid #2d2d44",
              color: "#e2e8f0",
            },
          }}
        />
        <SidebarProvider>
          <AnimatePresence mode="wait">
            <motion.div
              key={router.pathname}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-screen"
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </SidebarProvider>
      </NuqsAdapter>
    </UserProvider>
  );
}
