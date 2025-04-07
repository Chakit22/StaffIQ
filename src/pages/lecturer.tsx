"use client";

import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/components/layout";
import LecturerComponent from "@/components/lecturer";

export default function Lecturer() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (!user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <Layout>
      <LecturerComponent />
    </Layout>
  );
}
