import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AgencyAnalyticsList from './AgencyAnalyticsList';
import AgencyAnalyticsDetail from './AgencyAnalyticsDetail';
import AgencyAnalyticsForm from './AgencyAnalyticsForm';

const AgencyAnalyticsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AgencyAnalyticsList />} />
      <Route path="/create" element={<AgencyAnalyticsForm />} />
      <Route path="/:analyticsId" element={<AgencyAnalyticsDetail />} />
      <Route path="/:analyticsId/edit" element={<AgencyAnalyticsForm />} />
      <Route path="*" element={<Navigate to="/agency-analytics" replace />} />
    </Routes>
  );
};

export default AgencyAnalyticsRoutes;