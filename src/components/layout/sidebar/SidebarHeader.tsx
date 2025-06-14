
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useTranslation } from "react-i18next";

interface SidebarHeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
      <div className="flex items-center">
        {isOpen ? (
          <h1 className="text-xl font-bold text-sidebar-foreground">{t("appName")}</h1>
        ) : (
          <span className="text-xl font-bold text-sidebar-foreground">RL</span>
        )}
      </div>
      <div className="flex items-center">
        <LanguageSelector />
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default SidebarHeader;
