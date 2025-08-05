import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, LayoutDashboard, Users, Send, Building, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DelegationProvider } from "@/contexts/delegation";
import { createApiClient } from "@/services/backendApi";
import { OrganizationsApi } from "@/generated-api/src/apis";

const DelegationLayout: React.FC = () => {
  const { t } = useTranslation();
  const { advertiserOrgId } = useParams<{ advertiserOrgId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [organizationName, setOrganizationName] = useState<string>("");

  useEffect(() => {
    const fetchOrganizationName = async () => {
      if (advertiserOrgId) {
        try {
          const api = await createApiClient(OrganizationsApi);
          const response = await api.organizationsIdGet({
            id: parseInt(advertiserOrgId),
            withExtra: true,
          });
          setOrganizationName(response.name || `Organization ${advertiserOrgId}`);
        } catch (error) {
          console.error("Error fetching organization:", error);
          setOrganizationName(`Organization ${advertiserOrgId}`);
        }
      }
    };
    
    fetchOrganizationName();
  }, [advertiserOrgId]);

  const navigationItems = [
    {
      label: t('delegations.dashboard'),
      path: `/delegations/${advertiserOrgId}`,
      icon: LayoutDashboard,
    },
    {
      label: t('delegations.campaigns'),
      path: `/delegations/${advertiserOrgId}/campaigns`,
      icon: Building,
    },
    {
      label: t('delegations.invitations'),
      path: `/delegations/${advertiserOrgId}/invitations`,
      icon: Send,
    },
    {
      label: t('delegations.associations'),
      path: `/delegations/${advertiserOrgId}/associations`,
      icon: Users,
    },
    {
      label: t('sidebar.reports'),
      path: `/delegations/${advertiserOrgId}/reports`,
      icon: BarChart3,
    },
  ];

  const isActive = (path: string) => {
    if (path === `/delegations/${advertiserOrgId}` && location.pathname === path) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <DelegationProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/delegations')}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('delegations.backToDelegations')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {t('delegations.managingOrganization', { organizationName })}
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Management Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Button
                    key={item.path}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "gap-2",
                      active && "bg-primary text-primary-foreground"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div>
          <Outlet />
        </div>
      </div>
    </DelegationProvider>
  );
};

export default DelegationLayout;