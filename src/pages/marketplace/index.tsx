
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import AdvertiserMarketplace from "./AdvertiserMarketplace";

const MarketplacePage: React.FC = () => {
  const { organization } = useAuth();

  // Only advertisers can access the marketplace
  if (organization?.type !== 'advertiser') {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdvertiserMarketplace />;
};

export default MarketplacePage;
