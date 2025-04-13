"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import TutorComponent from "@/components/tutor";

export default function Tutor() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1733306464128-d6b80ed2f2e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md min-h-screen">
        <Layout>
          <TutorComponent />
        </Layout>
      </div>
    </div>
  );
}
