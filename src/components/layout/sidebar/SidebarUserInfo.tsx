
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useTranslation } from "react-i18next";
import { useDebugMode } from "@/hooks/useDebugMode";

interface SidebarUserInfoProps {
  isOpen: boolean;
}

const SidebarUserInfo: React.FC<SidebarUserInfoProps> = ({ isOpen }) => {
  const { user, profile, organization } = useAuth();
  const { t } = useTranslation();
  const { debugMode, enableDebugMode, backendUrl, setBackendUrl, resetBackendUrl } = useDebugMode();
  const [clickCount, setClickCount] = useState(0);
  const [tempUrl, setTempUrl] = useState(backendUrl || '');

  const handleEmailClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      enableDebugMode();
      setClickCount(0);
    }
    
    // Reset counter after 3 seconds if not reached 5 clicks
    setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };

  const handleUrlUpdate = () => {
    setBackendUrl(tempUrl);
  };

  const handleReset = () => {
    resetBackendUrl();
    setTempUrl('');
  };

  if (!isOpen || !profile) return null;

  return (
    <div className="p-4 bg-sidebar-accent/30">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-sidebar-foreground">
          {profile.first_name} {profile.last_name}
        </span>
        <span 
          className="text-xs text-sidebar-foreground/70 cursor-pointer select-none"
          onClick={handleEmailClick}
          title={`Click ${5 - clickCount} more times to enable debug mode`}
        >
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
        
        {debugMode && (
          <div className="mt-4 p-3 bg-sidebar-border/20 rounded-md">
            <div className="text-xs font-medium text-sidebar-foreground mb-2">
              🐛 Debug Mode
            </div>
            <div className="space-y-2">
              <div className="text-xs text-sidebar-foreground/70">
                Backend URL:
              </div>
              <Input
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="http://localhost:8080/api/v1"
                className="text-xs h-8"
              />
              <div className="flex gap-1">
                <Button 
                  onClick={handleUrlUpdate}
                  size="sm" 
                  className="text-xs h-7 flex-1"
                  disabled={!tempUrl.trim()}
                >
                  Set
                </Button>
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  size="sm" 
                  className="text-xs h-7 flex-1"
                >
                  Reset
                </Button>
              </div>
              {backendUrl && (
                <div className="text-xs text-green-600">
                  Active: {backendUrl}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarUserInfo;
