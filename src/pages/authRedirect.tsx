"use client"; //Runs on the client side

import { useAuth } from "@/context/UserProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "./signin";

export default function Home() {
  const { user, loading } = useAuth(); //Get user and loading state
  const router = useRouter(); //For page navigation

  useEffect(() => {
    if (!loading && user) {
      //Redirect to dashboard based on role
      if (user.role === "lecturer") {
        router.replace("/lecturer");
      } else if (user.role === "tutor") {
        router.replace("/tutor");
      }
    }
  }, [user, loading, router]);

  if (loading) return null; //Wait until user data loads

  if (user) return null; //If already logged in, don't show form

  return <SignInForm />; //Show sign-in form if not logged in
}
