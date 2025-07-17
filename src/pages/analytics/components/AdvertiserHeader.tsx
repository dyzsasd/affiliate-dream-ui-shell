
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DomainAutocompleteResult } from '@/generated-api/src/models/DomainAutocompleteResult';

interface AdvertiserHeaderProps {
  advertiser: DomainAutocompleteResult | null;
}

const AdvertiserHeader: React.FC<AdvertiserHeaderProps> = ({ advertiser }) => {
  const { t } = useTranslation();

  const getDisplayName = (advertiser: DomainAutocompleteResult | null) => {
    if (!advertiser) return 'Loading...';
    return advertiser.name || advertiser.domain || '';
  };

  const getLogoInitial = (advertiser: DomainAutocompleteResult | null) => {
    if (!advertiser) return 'L';
    const name = getDisplayName(advertiser);
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
        <span className="text-white text-2xl font-bold">{getLogoInitial(advertiser)}</span>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{getDisplayName(advertiser)}</h1>
        <p className="text-gray-600">{t('analytics.advertiserAnalytics')}</p>
        {advertiser?.domain && (
          <p className="text-sm text-gray-500">{advertiser.domain}</p>
        )}
      </div>
    </div>
  );
};

export default AdvertiserHeader;
