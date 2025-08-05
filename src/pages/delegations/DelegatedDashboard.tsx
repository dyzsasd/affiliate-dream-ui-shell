import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import AdvertiserDashboard from "@/pages/dashboard/AdvertiserDashboard";
import { useDelegation } from "@/contexts/delegation";

const DelegatedDashboard: React.FC = () => {
  const { advertiserOrgId } = useParams<{ advertiserOrgId: string }>();
  const { setDelegatedOrgId } = useDelegation();

  useEffect(() => {
    if (advertiserOrgId) {
      setDelegatedOrgId(Number(advertiserOrgId));
    }
    return () => setDelegatedOrgId(null);
  }, [advertiserOrgId, setDelegatedOrgId]);

  return <AdvertiserDashboard />;
};

export default DelegatedDashboard;