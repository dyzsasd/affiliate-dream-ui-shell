
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart3, 
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Menu,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: "Campaigns",
      path: "/campaigns",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: "Tracking Links",
      path: "/tracking-links",
      icon: <LinkIcon className="w-5 h-5" />
    },
    {
      name: "Reports",
      path: "/reporting",
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      name: "Conversions",
      path: "/reporting/conversions",
      icon: <PieChart className="w-5 h-5" />
    }
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/") {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={cn(
        "h-screen flex flex-col bg-sidebar transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center">
          {isOpen ? (
            <h1 className="text-xl font-bold text-sidebar-foreground">AffiliatePro</h1>
          ) : (
            <span className="text-xl font-bold text-sidebar-foreground">AP</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col flex-grow py-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center h-12 px-4 text-sm font-medium transition-colors",
              isActive(item.path)
                ? "text-white bg-sidebar-accent"
                : "text-sidebar-foreground hover:text-white hover:bg-sidebar-accent/70"
            )}
          >
            <span className="flex items-center justify-center w-5 h-5 mr-3">
              {item.icon}
            </span>
            {isOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {isOpen && user && (
          <div className="mb-4">
            <p className="text-xs text-sidebar-foreground/80">Signed in as:</p>
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.email}
            </p>
          </div>
        )}

        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
            !isOpen && "px-2 justify-center"
          )}
          onClick={signOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          {isOpen && "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
