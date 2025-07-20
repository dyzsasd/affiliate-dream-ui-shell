
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

// Mock partners data - this would eventually come from API
const mockPartners = [
  { id: 1, name: "TechReview Pro", type: "blog", joinDate: "2024-01-15", performance: "high" as const },
  { id: 2, name: "Student Deals Hub", type: "student", joinDate: "2024-02-20", performance: "medium" as const },
  { id: 3, name: "Cashback Central", type: "incentive", joinDate: "2024-03-10", performance: "high" as const },
  { id: 4, name: "Digital Marketing Blog", type: "blog", joinDate: "2024-01-25", performance: "medium" as const },
  { id: 5, name: "University Network", type: "student", joinDate: "2024-02-15", performance: "high" as const },
  { id: 6, name: "Tech Forum Community", type: "forum", joinDate: "2024-03-05", performance: "low" as const },
  { id: 7, name: "Content Creator Hub", type: "content", joinDate: "2024-02-28", performance: "medium" as const },
  { id: 8, name: "Campus Deals", type: "student", joinDate: "2024-01-30", performance: "high" as const },
  { id: 9, name: "Reward Portal", type: "incentive", joinDate: "2024-03-12", performance: "medium" as const },
  { id: 10, name: "Tech News Daily", type: "blog", joinDate: "2024-02-10", performance: "high" as const }
];

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
      const response = await apiClient.apiV1AnalyticsAdvertisersIdGet({
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
            partners={mockPartners}
            advertiserName={getDisplayName(currentAdvertiser)}
          />
        </>
      )}
    </div>
  );
};

export default AdvertiserAnalytics;
