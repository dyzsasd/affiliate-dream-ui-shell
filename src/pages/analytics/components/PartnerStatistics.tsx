
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

interface PartnerStatisticsProps {
  partnerInfo: PartnerInformation | undefined;
  onViewPartnersClick: () => void;
  onViewNewPartnersClick?: () => void;
}

const PartnerStatistics: React.FC<PartnerStatisticsProps> = ({ 
  partnerInfo, 
  onViewPartnersClick,
  onViewNewPartnersClick 
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-8">
          {/* Total Partners */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">{t('analytics.totalPartners')}</div>
            <div className="flex items-center justify-center gap-2">
              <ArrowUp className="w-4 h-4 text-green-500" />
              <span className="text-3xl font-bold text-green-500">
                {partnerInfo?.partners?.count || '0'}
              </span>
            </div>
            <Button 
              variant="link" 
              className="text-sm text-gray-600 mt-2"
              onClick={onViewPartnersClick}
            >
              {t('analytics.viewPartners')}
            </Button>
          </div>

          {/* New Partners */}
          <div className="text-center border-l border-r border-gray-200 px-8">
            <div className="text-sm text-gray-600 mb-2">{t('analytics.newPartners')}</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-green-500">
                +{partnerInfo?.partnersAdded?.count || '0'}
              </span>
            </div>
            <Button 
              variant="link" 
              className="text-sm text-gray-600 mt-2"
              onClick={onViewNewPartnersClick}
            >
              {t('analytics.showMe')}
            </Button>
          </div>

          {/* Lost Partners */}
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-6">{t('analytics.lostPartners')}</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-purple-500">
                -{partnerInfo?.partnersRemoved?.count || '0'}
              </span>
            </div>
            <Button variant="link" className="text-sm text-gray-600 mt-2">
              {t('analytics.showMe')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerStatistics;
