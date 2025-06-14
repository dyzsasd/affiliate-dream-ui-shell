
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";
import { useTranslation } from "react-i18next";
import { getNavItems } from "./utils/navigationItems";

interface SidebarNavigationProps {
  isOpen: boolean;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isOpen }) => {
  const location = useLocation();
  const { organization } = useAuth();
  const { t } = useTranslation();

  const navItems = getNavItems(organization?.type, t);

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/") {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col flex-grow py-4 overflow-y-auto">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        return (
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
              <IconComponent className="w-5 h-5" />
            </span>
            {isOpen && <span>{item.name}</span>}
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarNavigation;
