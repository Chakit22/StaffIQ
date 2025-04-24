"use client"; //Runs on the client side

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "./signin";
import LoaderComponent from "@/components/Loading";
import { useUserStore } from "@/stores/user-store";
export default function Home() {
  const { user, userLoading } = useUserStore(); //Get user and loading state
  const router = useRouter(); //For page navigation

  useEffect(() => {
    if (!userLoading) {
      if (!user) router.replace("/signin");
      else router.replace(`/${user.role}`);
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return <LoaderComponent />;
  }

  return <SignInForm />; //Show sign-in form if not logged in
}
