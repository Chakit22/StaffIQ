"use client"; //Make sure this page runs in the browser (client-side)

import { useRouter } from "next/navigation"; //For navigation (redirecting)
import { Button } from "@/components/ui/button"; //Reusable styled buttons
import React from "react";


export default function HomePage() {
  const router = useRouter(); //Hook for navigating programmatically

  return (
    //Main container that fills the screen with background image
    <main
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      {/* Card in the center with semi-transparent white background */}
      <div className="bg-white/70 backdrop-blur-md p-10 rounded-xl shadow-xl text-black max-w-lg w-full text-center space-y-6">
        
        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome to <span className="text-blue-500">TeachTeam</span>
        </h1>

        {/* Subheading/description */}
        <p className="text-lg md:text-xl text-gray-700">
          Smart solutions for structured academic staffing
        </p>

        {/* Sign in and Sign up buttons */}
        <div className="flex gap-4 justify-center mt-6 flex-wrap">
          <Button onClick={() => router.push("/signin")}>Sign In</Button>
          <Button variant="outline" onClick={() => router.push("/signup")}>
            Sign Up
          </Button>
        </div>
      </div>

      {/* Footer with a soft transparent background */}
      <footer className="mt-12 text-sm text-black/80 bg-white/60 px-4 py-2 rounded shadow-sm">
        Built by Team TeachTeam
      </footer>
    </main>
  );
}
