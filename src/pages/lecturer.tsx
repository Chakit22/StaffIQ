"use client";

import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Lecturer() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <div className="text-black text-2xl w-full flex justify-center items-center min-h-screen">
      Lecturers
    </div>
  );
}
