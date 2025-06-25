
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AdvertiserData {
  advertiser?: {
    keywords?: {
      count?: number;
      value?: any[];
    };
    verticals?: {
      sampleValue?: {
        name?: string;
        rank?: number;
      };
    };
  };
}

interface AnalyticsCardsProps {
  advertiserData: AdvertiserData | null;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ advertiserData }) => {
  const { t } = useTranslation();

  return (
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
  );
};

export default AnalyticsCards;
