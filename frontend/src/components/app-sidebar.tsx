import { Home, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/UserProvider";

export function AppSidebar() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
  logout(); // Clears user and localStorage
  router.replace("/signin");
};


  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold">
            TeachTeam
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="Home">
                <Button onClick={() => router.push("/")} variant="outline">
                  <Home />
                  <span>Home</span>
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem key="Logout">
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut />
                  Logout
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
