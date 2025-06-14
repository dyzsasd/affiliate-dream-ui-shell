
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth";
import { useTranslation } from "react-i18next";

interface SidebarUserInfoProps {
  isOpen: boolean;
}

const SidebarUserInfo: React.FC<SidebarUserInfoProps> = ({ isOpen }) => {
  const { user, profile, organization } = useAuth();
  const { t } = useTranslation();

  if (!isOpen || !profile) return null;

  return (
    <div className="p-4 bg-sidebar-accent/30">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-sidebar-foreground">
          {profile.first_name} {profile.last_name}
        </span>
        <span className="text-xs text-sidebar-foreground/70">
          {user?.email}
        </span>
        <div className="mt-2 space-y-1">
          <Badge variant="outline" className="text-xs bg-sidebar-accent text-sidebar-foreground border-sidebar-border">
            {profile.role?.name || t("profile.notAssigned")}
          </Badge>
          {organization && (
            <Badge variant="outline" className="text-xs bg-sidebar-accent text-sidebar-foreground border-sidebar-border">
              {organization.type || 'Unknown'}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarUserInfo;
