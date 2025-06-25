
import React from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
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
  );
};

export default EmptyState;
