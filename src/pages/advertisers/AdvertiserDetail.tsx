
import React from 'react';
import { Card } from '@/components/ui/card';
import { AdvertiserHeader } from './components/AdvertiserHeader';
import { AdvertiserInfo } from './components/AdvertiserInfo';
import { AdvertiserActions } from './components/AdvertiserActions';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { useAdvertiserDetail } from './hooks/useAdvertiserDetail';

const AdvertiserDetail: React.FC = () => {
  const { 
    advertiser, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    advertiserId 
  } = useAdvertiserDetail();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!advertiser) {
    return <ErrorState isNotFound />;
  }

  return (
    <div className="container py-6">
      <AdvertiserHeader advertiser={advertiser} />
      <Card>
        <AdvertiserInfo advertiser={advertiser} />
        <AdvertiserActions advertiserId={Number(advertiserId)} />
      </Card>
    </div>
  );
};

export default AdvertiserDetail;
