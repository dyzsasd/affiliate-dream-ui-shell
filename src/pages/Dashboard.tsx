
import React from "react";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";
import AdvertiserDashboard from "./dashboard/AdvertiserDashboard";
import AffiliateDashboard from "./dashboard/AffiliateDashboard";
import PlatformOwnerDashboard from "./dashboard/PlatformOwnerDashboard";

const Dashboard: React.FC = () => {
  const { organization, isOrganizationLoading } = useAuth();

  if (isOrganizationLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-affiliate-primary" />
      </div>
    );
  }

  // Determine which dashboard to show based on organization type
  const organizationType = organization?.type;

  switch (organizationType) {
    case 'advertiser':
      return <AdvertiserDashboard />;
    case 'affiliate':
      return <AffiliateDashboard />;
    case 'platform_owner':
      return <PlatformOwnerDashboard />;
    default:
      // Fallback to advertiser dashboard if no organization type is found
      return <AdvertiserDashboard />;
  }
};

export default Dashboard;
