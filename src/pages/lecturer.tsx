"use client"; //Runs on the client side

import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/components/layout";
import LecturerComponent from "@/components/lecturer";

export default function LecturerPage() {
  const { user } = useAuth(); //Get current user
  const router = useRouter(); //For navigation

  useEffect(() => {
    if (!user) {
      router.replace("/signin"); //Redirect if not signed in
    }
  }, [user]);

  return (
    <Layout>
      <LecturerComponent /> {/*Main lecturer dashboard content*/}
    </Layout>
  );
}
