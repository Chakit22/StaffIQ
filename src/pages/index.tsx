import { useEffect, useState } from "react";
import SignInForm from "./signin";
import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only check redirection if auth has finished loading
    if (!authLoading && user) {
      setIsRedirecting(true);
      // Redirect based on user role
      if (user.role === "lecturer") {
        router.replace("/lecturer");
      } else if (user.role === "tutor" || user.role === "student") {
        router.replace("/tutor");
      }
    }
  }, [user, authLoading, router]);

  // Show loading overlay when auth is loading or while redirecting
  if (authLoading || isRedirecting) {
    return <LoadingOverlay fullScreen text="Loading..." />;
  }

  // If user is not logged in or authLoading is false, show SignInForm
  return <SignInForm />;
}
