"use client";

import { LogOut, Home } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Navbar() {
  const { logoutUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logoutUser();
    if (response.success) {
      toast.success(response.message);
      router.replace("/signin");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <div className="h-20 border-2 flex justify-between items-center p-6">
        <div className="flex justify-center items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Link className="text-2xl text-bold text-foreground" href="/">
            TeachTeam
          </Link>
        </div>
        <div className="hidden md:flex gap-4">
          <Button onClick={() => router.push("/")} variant="outline">
            <Home size={18} />
            Home
          </Button>
          <Button onClick={handleLogout}>
            <LogOut />
            Logout
          </Button>
        </div>
      </div>
      <AppSidebar />
    </>
  );
}
