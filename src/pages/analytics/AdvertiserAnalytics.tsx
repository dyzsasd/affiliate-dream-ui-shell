
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import AdvertiserSearch from './components/AdvertiserSearch';
import AdvertiserHeader from './components/AdvertiserHeader';
import PartnerStatistics from './components/PartnerStatistics';
import AffiliateMixChart from './components/AffiliateMixChart';
import AnalyticsCards from './components/AnalyticsCards';
import PartnersModal from './components/PartnersModal';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';
import { createApiClient } from '@/services/backendApi';
import { AnalyticsApi } from '@/generated-api/src/apis/AnalyticsApi';
import { DomainAutocompleteResult } from '@/generated-api/src/models/DomainAutocompleteResult';

// Type definitions for partner information structure
interface PromotypeData {
  promotype?: string;
  count?: number;
}

interface PartnerInformation {
  promotypeMix?: {
    value?: PromotypeData[];
  };
  partners?: {
    count?: number;
  };
  partnersAdded?: {
    count?: number;
  };
  partnersRemoved?: {
    count?: number;
  };
}

// Empty partners data since mock data removed
const partners: any[] = [];

const COLORS = {
  student: '#ef4444',
  blog: '#f97316',
  incentive: '#eab308',
  content: '#8b5cf6',
  forum: '#10b981'
};

const AdvertiserAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const { advertiserId } = useParams<{ advertiserId: string }>();
  const navigate = useNavigate();
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<DomainAutocompleteResult | null>(null);
  const [isPartnersModalOpen, setIsPartnersModalOpen] = useState(false);

  // Query for advertiser details
  const { data: advertiserData, isLoading: isLoadingAdvertiser } = useQuery({
    queryKey: ['advertiser-analytics', advertiserId || selectedAdvertiser?.id],
    queryFn: async () => {
      const id = advertiserId || selectedAdvertiser?.id;
      if (!id) return null;
      
      const apiClient = await createApiClient(AnalyticsApi);
      const response = await apiClient.analyticsAdvertisersIdGet({
        id: parseInt(id.toString())
      });
      
      return response.data;
    },
    enabled: !!(advertiserId || selectedAdvertiser?.id),
  });

  const handleAdvertiserSelect = (advertiser: DomainAutocompleteResult) => {
    setSelectedAdvertiser(advertiser);
    // Navigate to the advertiser-specific URL
    navigate(`/analytics/advertiser/${advertiser.id}`);
  };

  const getDisplayName = (advertiser?: DomainAutocompleteResult) => {
    if (advertiser) {
      return advertiser.name || advertiser.domain || '';
    }
    // If we have advertiser data from URL, try to get name from there
    return (advertiserData?.advertiser as any)?.name || (advertiserData?.advertiser as any)?.domain || '';
  };

  // Process chart data from API response with proper type safety
  const getChartData = () => {
    const partnerInfo = advertiserData?.advertiser?.partnerInformation as PartnerInformation;
    if (!partnerInfo?.promotypeMix?.value) {
      return [];
    }

    return partnerInfo.promotypeMix.value.map(item => ({
      name: item.promotype || '',
      value: item.count || 0,
      color: COLORS[item.promotype as keyof typeof COLORS] || '#6b7280'
    }));
  };

  const chartData = getChartData();

  // Helper function to safely get partner information
  const getPartnerInfo = () => {
    return advertiserData?.advertiser?.partnerInformation as PartnerInformation;
  };

  // Effect to set selectedAdvertiser when URL changes
  useEffect(() => {
    if (advertiserId && advertiserData?.advertiser) {
      // Create a mock DomainAutocompleteResult from advertiser data
      const advertiser: DomainAutocompleteResult = {
        id: parseInt(advertiserId),
        name: (advertiserData.advertiser as any)?.name,
        domain: (advertiserData.advertiser as any)?.domain,
      };
      setSelectedAdvertiser(advertiser);
    }
  }, [advertiserId, advertiserData]);

  const currentAdvertiser = selectedAdvertiser;
  const showContent = advertiserId || selectedAdvertiser;

  return (
    <div className="space-y-6 p-6">
      {/* Search Bar - only show if no advertiser is selected via URL */}
      {!advertiserId && <AdvertiserSearch onSelect={handleAdvertiserSelect} />}

      {/* Empty State or Analytics Content */}
      {!showContent ? (
        <EmptyState />
      ) : isLoadingAdvertiser ? (
        <LoadingState advertiser={currentAdvertiser} />
      ) : (
        <>
          {/* Header with selected advertiser name and logo */}
          <AdvertiserHeader advertiser={currentAdvertiser} />

          {/* Partner Statistics */}
          <PartnerStatistics 
            partnerInfo={getPartnerInfo()}
            onViewPartnersClick={() => navigate(`/analytics/advertiser/${advertiserId || currentAdvertiser?.id}/all_partners`)}
            onViewNewPartnersClick={() => navigate(`/analytics/advertiser/${advertiserId || currentAdvertiser?.id}/new_partners`)}
            onViewLostPartnersClick={() => navigate(`/analytics/advertiser/${advertiserId || currentAdvertiser?.id}/lost_partners`)}
          />

          {/* Affiliate Mix Chart */}
          <AffiliateMixChart chartData={chartData} />

          {/* Analytics Cards */}
          <AnalyticsCards advertiserData={advertiserData} />

          {/* Partners Modal */}
          <PartnersModal 
            isOpen={isPartnersModalOpen}
            onClose={() => setIsPartnersModalOpen(false)}
            partners={partners}
            advertiserName={getDisplayName(currentAdvertiser)}
          />
        </>
      )}
    </div>
  );
};

export default AdvertiserAnalytics;
