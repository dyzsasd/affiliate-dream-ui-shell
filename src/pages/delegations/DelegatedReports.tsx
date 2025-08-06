import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PerformanceReport from "@/pages/reporting/PerformanceReport";
import { useDelegation } from "@/contexts/delegation";

const DelegatedReports: React.FC = () => {
  const { advertiserOrgId } = useParams<{ advertiserOrgId: string }>();
  const { setDelegatedOrgId } = useDelegation();

  useEffect(() => {
    if (advertiserOrgId) {
      setDelegatedOrgId(Number(advertiserOrgId));
    }
    return () => setDelegatedOrgId(null);
  }, [advertiserOrgId, setDelegatedOrgId]);

  return <PerformanceReport />;
};

export default DelegatedReports;