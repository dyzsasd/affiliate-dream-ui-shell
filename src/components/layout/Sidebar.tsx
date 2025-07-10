
import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarUserInfo from "./sidebar/SidebarUserInfo";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarFooter from "./sidebar/SidebarFooter";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={cn(
        "h-screen flex flex-col bg-sidebar transition-all duration-300 ease-in-out border-r border-sidebar-border",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <SidebarHeader isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <SidebarUserInfo isOpen={isOpen} />
      <SidebarNavigation isOpen={isOpen} />
      <Separator className="bg-sidebar-border" />
      <SidebarFooter isOpen={isOpen} />
    </div>
  );
};

export default Sidebar;
