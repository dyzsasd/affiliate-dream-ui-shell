
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdvertiserList from './AdvertiserList';
import AdvertiserForm from './AdvertiserForm';
import AdvertiserDetail from './AdvertiserDetail';

const AdvertisersRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdvertiserList />} />
      <Route path="/create" element={<AdvertiserForm />} />
      <Route path="/:advertiserId" element={<AdvertiserDetail />} />
      <Route path="/edit/:advertiserId" element={<AdvertiserForm />} />
      <Route path="*" element={<Navigate to="/advertisers" replace />} />
    </Routes>
  );
};

export default AdvertisersRoutes;
