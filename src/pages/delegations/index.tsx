import React from "react";
import { Routes, Route } from "react-router-dom";
import DelegationsList from "./DelegationsList";
import DelegationLayout from "./DelegationLayout";
import DelegatedDashboard from "./DelegatedDashboard";
import DelegatedCampaigns from "./DelegatedCampaigns";
import DelegatedInvitations from "./DelegatedInvitations";
import DelegatedAssociations from "./DelegatedAssociations";

const DelegationsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DelegationsList />} />
      <Route path=":advertiserOrgId" element={<DelegationLayout />}>
        <Route index element={<DelegatedDashboard />} />
        <Route path="campaigns" element={<DelegatedCampaigns />} />
        <Route path="invitations" element={<DelegatedInvitations />} />
        <Route path="associations" element={<DelegatedAssociations />} />
      </Route>
    </Routes>
  );
};

export default DelegationsRoutes;