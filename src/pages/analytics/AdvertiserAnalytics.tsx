
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import AdvertiserSearch from './components/AdvertiserSearch';
import PartnersModal from './components/PartnersModal';
import { createApiClient } from '@/services/backendApi';
import { AnalyticsApi } from '@/generated-api/src/apis/AnalyticsApi';
import { DomainAutocompleteResult } from '@/generated-api/src/models/DomainAutocompleteResult';

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
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<DomainAutocompleteResult | null>(null);
  const [isPartnersModalOpen, setIsPartnersModalOpen] = useState(false);

  // Query for advertiser details
  const { data: advertiserData, isLoading: isLoadingAdvertiser } = useQuery({
    queryKey: ['advertiser-analytics', selectedAdvertiser?.id],
    queryFn: async () => {
      if (!selectedAdvertiser?.id) return null;
      
      const apiClient = await createApiClient(AnalyticsApi);
      const response = await apiClient.apiV1AnalyticsAdvertisersIdGet({
        id: selectedAdvertiser.id
      });
      
      return response.data;
    },
    enabled: !!selectedAdvertiser?.id,
  });

  const handleAdvertiserSelect = (advertiser: DomainAutocompleteResult) => {
    setSelectedAdvertiser(advertiser);
  };

  const getDisplayName = (advertiser: DomainAutocompleteResult) => {
    return advertiser.name || advertiser.domain || '';
  };

  const getLogoInitial = (advertiser: DomainAutocompleteResult) => {
    const name = getDisplayName(advertiser);
    return name.charAt(0).toUpperCase();
  };

  // Process chart data from API response
  const getChartData = () => {
    if (!advertiserData?.advertiser?.partnerInformation?.promotypeMix?.value) {
      return [];
    }

    return advertiserData.advertiser.partnerInformation.promotypeMix.value.map(item => ({
      name: item.promotype || '',
      value: item.count || 0,
      color: COLORS[item.promotype as keyof typeof COLORS] || '#6b7280'
    }));
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 p-6">
      {/* Search Bar */}
      <AdvertiserSearch onSelect={handleAdvertiserSelect} />

      {/* Empty State or Analytics Content */}
      {!selectedAdvertiser ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-gray-400 mb-4">
            <Info className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            {t('analytics.selectAdvertiser')}
          </h2>
          <p className="text-gray-500">
            {t('analytics.selectAdvertiserDescription')}
          </p>
        </div>
      ) : isLoadingAdvertiser ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-gray-400 mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            Loading Analytics...
          </h2>
          <p className="text-gray-500">
            Fetching data for {getDisplayName(selectedAdvertiser)}
          </p>
        </div>
      ) : (
        <>
          {/* Header with selected advertiser name and logo */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{getLogoInitial(selectedAdvertiser)}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getDisplayName(selectedAdvertiser)}</h1>
              <p className="text-gray-600">{t('analytics.advertiserAnalytics')}</p>
              {selectedAdvertiser.domain && (
                <p className="text-sm text-gray-500">{selectedAdvertiser.domain}</p>
              )}
            </div>
          </div>

          {/* Partner Statistics */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Total Partners */}
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">{t('analytics.totalPartners')}</div>
                  <div className="flex items-center justify-center gap-2">
                    <ArrowUp className="w-4 h-4 text-green-500" />
                    <span className="text-3xl font-bold text-green-500">
                      {advertiserData?.advertiser?.partnerInformation?.partners?.count || '0'}
                    </span>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-sm text-gray-600 mt-2"
                    onClick={() => setIsPartnersModalOpen(true)}
                  >
                    {t('analytics.viewPartners')}
                  </Button>
                </div>

                {/* New Partners */}
                <div className="text-center border-l border-r border-gray-200 px-8">
                  <div className="text-sm text-gray-600 mb-2">{t('analytics.newPartners')}</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-green-500">
                      +{advertiserData?.advertiser?.partnerInformation?.partnersAdded?.count || '0'}
                    </span>
                  </div>
                  <Button variant="link" className="text-sm text-gray-600 mt-2">
                    {t('analytics.showMe')}
                  </Button>
                </div>

                {/* Lost Partners */}
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-6">{t('analytics.lostPartners')}</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-purple-500">
                      -{advertiserData?.advertiser?.partnerInformation?.partnersRemoved?.count || '0'}
                    </span>
                  </div>
                  <Button variant="link" className="text-sm text-gray-600 mt-2">
                    {t('analytics.showMe')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affiliate Mix Chart */}
          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{t('analytics.affiliateMixChart')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-12">
                  <div className="w-64 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {chartData.map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-base text-gray-700 capitalize">{item.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({item.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Top 20 Keywords */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  {t('analytics.topKeywords')}
                  <Info className="w-4 h-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  {advertiserData?.advertiser?.keywords?.count === 0 || !advertiserData?.advertiser?.keywords?.value?.length ? 
                    t('analytics.noKeywordsFound') : 
                    'Keywords data available'
                  }
                </div>
              </CardContent>
            </Card>

            {/* Vertical Positioning */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  {t('analytics.verticalPositioning')}
                  <Info className="w-4 h-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {advertiserData?.advertiser?.verticals?.sampleValue ? (
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold">{t('analytics.type')}: </span>
                      <span className="text-gray-600">{advertiserData.advertiser.verticals.sampleValue.name}</span>
                    </div>
                    <div>
                      <span className="font-semibold">{t('analytics.rank')}: </span>
                      <span className="text-gray-600">#{advertiserData.advertiser.verticals.sampleValue.rank}</span>
                    </div>
                    <div className="mt-6">
                      <div className="font-semibold text-gray-700 mb-2">{t('analytics.topPublishersInVertical')}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No vertical data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Partners Modal */}
          <PartnersModal 
            isOpen={isPartnersModalOpen}
            onClose={() => setIsPartnersModalOpen(false)}
            partners={mockPartners}
            advertiserName={getDisplayName(selectedAdvertiser)}
          />
        </>
      )}
    </div>
  );
};

export default AdvertiserAnalytics;
