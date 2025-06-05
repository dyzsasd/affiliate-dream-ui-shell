
import React from "react";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";
import AdvertiserDashboard from "./dashboard/AdvertiserDashboard";
import AffiliateDashboard from "./dashboard/AffiliateDashboard";
import PlatformOwnerDashboard from "./dashboard/PlatformOwnerDashboard";

const Dashboard: React.FC = () => {
  const { organization, isOrganizationLoading, isProfileLoading } = useAuth();

  console.log("Dashboard rendering - organization:", organization);
  console.log("Dashboard rendering - isOrganizationLoading:", isOrganizationLoading);
  console.log("Dashboard rendering - isProfileLoading:", isProfileLoading);

  if (isOrganizationLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-affiliate-primary" />
      </div>
    );
  }

  // Determine which dashboard to show based on organization type
  const organizationType = organization?.type;
  console.log("Organization type:", organizationType);

  switch (organizationType) {
    case 'advertiser':
      return <AdvertiserDashboard />;
    case 'affiliate':
      return <AffiliateDashboard />;
    case 'platform_owner':
      return <PlatformOwnerDashboard />;
    default:
      // Show a message if no organization type is found
      if (!organization) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No Organization Found</h2>
              <p className="text-muted-foreground">
                Your account is not associated with any organization. Please contact support.
              </p>
            </div>
          </div>
        );
      }
      // Fallback to advertiser dashboard if organization type is not recognized
      return <AdvertiserDashboard />;
  }
};

export default Dashboard;
