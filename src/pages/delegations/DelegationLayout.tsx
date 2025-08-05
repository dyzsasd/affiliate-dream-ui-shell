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
import { OrganizationsApi, AgencyDelegationsApi } from "@/generated-api/src/apis";

const DelegationLayout: React.FC = () => {
  const { t } = useTranslation();
  const { advertiserOrgId } = useParams<{ advertiserOrgId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [organizationName, setOrganizationName] = useState<string>(`Organization ${advertiserOrgId}`);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [accessError, setAccessError] = useState<string>("");

  useEffect(() => {
    const checkDelegationAndFetchOrg = async () => {
      if (advertiserOrgId) {
        try {
          // First check if there's a delegation relationship
          const delegationApi = await createApiClient(AgencyDelegationsApi);
          const delegations = await delegationApi.agencyDelegationsAdvertiserAdvertiserOrgIdGet({
            advertiserOrgId: parseInt(advertiserOrgId),
          });

          // Check if there's an active delegation
          const activeDelegation = delegations.find(delegation => 
            delegation.status === 'active' && 
            (!delegation.expiresAt || new Date(delegation.expiresAt) > new Date())
          );

          if (!activeDelegation) {
            setHasAccess(false);
            setAccessError("You don't have delegation access to this organization.");
            return;
          }

          // If delegation exists, fetch organization details
          const orgApi = await createApiClient(OrganizationsApi);
          const response = await orgApi.organizationsIdGet({
            id: parseInt(advertiserOrgId),
            withExtra: true,
          });
          
          setOrganizationName(response.name || `Organization ${advertiserOrgId}`);
          setHasAccess(true);
        } catch (error) {
          console.error("Error checking delegation or fetching organization:", error);
          setHasAccess(false);
          setAccessError("Failed to verify delegation access. Please contact support.");
        }
      }
    };
    
    checkDelegationAndFetchOrg();
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

  // Show loading state while checking access
  if (hasAccess === null) {
    return (
      <DelegationProvider>
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">{t('delegations.loading')}</div>
          </div>
        </div>
      </DelegationProvider>
    );
  }

  // Show access denied if no delegation relationship
  if (hasAccess === false) {
    return (
      <DelegationProvider>
        <div className="container mx-auto p-6 space-y-6">
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
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-xl font-semibold text-destructive">Access Denied</div>
                <div className="text-muted-foreground">{accessError}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DelegationProvider>
    );
  }

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