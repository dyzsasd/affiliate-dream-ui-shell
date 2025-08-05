import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import InvitationManagement from "@/pages/invitations/InvitationManagement";
import { useDelegation } from "@/contexts/delegation";

const DelegatedInvitations: React.FC = () => {
  const { advertiserOrgId } = useParams<{ advertiserOrgId: string }>();
  const { setDelegatedOrgId } = useDelegation();

  useEffect(() => {
    if (advertiserOrgId) {
      setDelegatedOrgId(Number(advertiserOrgId));
    }
    return () => setDelegatedOrgId(null);
  }, [advertiserOrgId, setDelegatedOrgId]);

  return <InvitationManagement />;
};

export default DelegatedInvitations;