import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CampaignList from "@/pages/campaigns/CampaignList";
import { useDelegation } from "@/contexts/delegation";

const DelegatedCampaigns: React.FC = () => {
  const { advertiserOrgId } = useParams<{ advertiserOrgId: string }>();
  const { setDelegatedOrgId } = useDelegation();

  useEffect(() => {
    if (advertiserOrgId) {
      setDelegatedOrgId(Number(advertiserOrgId));
    }
    return () => setDelegatedOrgId(null);
  }, [advertiserOrgId, setDelegatedOrgId]);

  return <CampaignList />;
};

export default DelegatedCampaigns;