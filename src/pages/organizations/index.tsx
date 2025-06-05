
import React from "react";
import { Routes, Route } from "react-router-dom";
import OrganizationList from "./OrganizationList";
import OrganizationEdit from "./OrganizationEdit";

const OrganizationsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<OrganizationList />} />
      <Route path=":id/edit" element={<OrganizationEdit />} />
    </Routes>
  );
};

export default OrganizationsRoutes;
