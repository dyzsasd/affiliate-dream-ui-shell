import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AffiliateList from './AffiliateList';

const AffiliatesRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AffiliateList />} />
      <Route path="*" element={<Navigate to="/affiliates" replace />} />
    </Routes>
  );
};

export default AffiliatesRoutes;