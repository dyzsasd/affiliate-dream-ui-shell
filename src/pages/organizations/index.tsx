
import React from "react";
import { Routes, Route } from "react-router-dom";
import OrganizationList from "./OrganizationList";

const OrganizationsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<OrganizationList />} />
    </Routes>
  );
};

export default OrganizationsRoutes;
