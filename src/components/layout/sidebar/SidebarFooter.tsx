
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";
import { useTranslation } from "react-i18next";

interface SidebarFooterProps {
  isOpen: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ isOpen }) => {
  const { signOut } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
          !isOpen && "px-2 justify-center"
        )}
        onClick={signOut}
      >
        <LogOut className="w-5 h-5 mr-2" />
        {isOpen && t("auth.signOut")}
      </Button>
    </div>
  );
};

export default SidebarFooter;
