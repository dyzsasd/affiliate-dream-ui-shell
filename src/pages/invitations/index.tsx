import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InvitationList from './InvitationList';
import InvitationForm from './InvitationForm';
import InvitationDetail from './InvitationDetail';
import PublicInvitation from './PublicInvitation';

const InvitationRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<InvitationList />} />
      <Route path="new" element={<InvitationForm />} />
      {/* Public invitation route for tokens - must come before :id route */}
      <Route path=":token" element={<PublicInvitation />} />
      <Route path=":id/edit" element={<InvitationForm />} />
    </Routes>
  );
};

export default InvitationRoutes;
export { PublicInvitation };