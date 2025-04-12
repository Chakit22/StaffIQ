"use client";

import React from "react";

import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/components/layout";
import TutorComponent from "@/components/tutor";

export default function Tutor() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (!user) {
      router.replace("/");
    }
  }, []);

  return (
    <Layout>
      <TutorComponent />
    </Layout>
  );
}
