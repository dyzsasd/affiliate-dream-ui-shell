import React from "react";
import { Routes, Route } from "react-router-dom";
import AgencyCampaignList from "./AgencyCampaignList";
import AgencyCampaignForm from "./AgencyCampaignForm";
import AgencyCampaignDetail from "./AgencyCampaignDetail";

const AgencyCampaignsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AgencyCampaignList />} />
      <Route path="create" element={<AgencyCampaignForm />} />
      <Route path=":id" element={<AgencyCampaignDetail />} />
      <Route path=":id/edit" element={<AgencyCampaignForm />} />
    </Routes>
  );
};

export default AgencyCampaignsRoutes;