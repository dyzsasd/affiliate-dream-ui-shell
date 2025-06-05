
import React from "react";
import { Routes, Route } from "react-router-dom";
import InvitationManagement from "./InvitationManagement";

const InvitationsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<InvitationManagement />} />
    </Routes>
  );
};

export default InvitationsRoutes;
