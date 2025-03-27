"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div className="w-full h-20 border-2 flex justify-between items-center p-8">
      <Link
        className="text-2xl text-bold text-foreground"
        href={user ? user.role : "/"}
      >
        TeachTeam
      </Link>
      <Button
        className="flex justify-center items-center gap-2 cursor-pointer"
        onClick={handleLogout}
      >
        <LogOut />
        Logout
      </Button>
    </div>
  );
}
