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
      <Route path=":id/edit" element={<InvitationForm />} />
      <Route path=":id" element={<InvitationDetail />} />
    </Routes>
  );
};

export default InvitationRoutes;
export { PublicInvitation };