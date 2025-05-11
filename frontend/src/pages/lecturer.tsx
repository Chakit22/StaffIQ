"use client"; //Runs on the client side

import React, { useEffect } from "react";
import { useAuth } from "../context/UserProvider";
import { useRouter } from "next/navigation";
import Layout from "../components/layout";
import LecturerComponent from "../components/lecturer";
import { RankingProvider } from "../context/RankingProvider";

export default function LecturerPage() {
  const { user, loading: userLoading } = useAuth(); //Get current user
  const router = useRouter(); //For navigation

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/signin"); //Redirect if not signed in
    }
  }, [user, userLoading, router]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1679547202671-f9dbbf466db4?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      {/* Overlay with blur and light background */}
      <div className="min-h-screen bg-white/80 backdrop-blur-sm">
        <Layout>
          <RankingProvider>
            <LecturerComponent /> {/*Main lecturer dashboard content*/}
          </RankingProvider>
        </Layout>
      </div>
    </div>
  );
}
