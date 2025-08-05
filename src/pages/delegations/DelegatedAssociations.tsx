import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import AssociationsManagement from "@/pages/associations/AssociationsManagement";
import { useDelegation } from "@/contexts/delegation";

const DelegatedAssociations: React.FC = () => {
  const { advertiserOrgId } = useParams<{ advertiserOrgId: string }>();
  const { setDelegatedOrgId } = useDelegation();

  useEffect(() => {
    if (advertiserOrgId) {
      setDelegatedOrgId(Number(advertiserOrgId));
    }
    return () => setDelegatedOrgId(null);
  }, [advertiserOrgId, setDelegatedOrgId]);

  return <AssociationsManagement />;
};

export default DelegatedAssociations;