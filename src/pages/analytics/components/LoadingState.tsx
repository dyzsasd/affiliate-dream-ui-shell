
import React from 'react';
import { DomainAutocompleteResult } from '@/generated-api/src/models/DomainAutocompleteResult';

interface LoadingStateProps {
  advertiser: DomainAutocompleteResult;
}

const LoadingState: React.FC<LoadingStateProps> = ({ advertiser }) => {
  const getDisplayName = (advertiser: DomainAutocompleteResult) => {
    return advertiser.name || advertiser.domain || '';
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-gray-400 mb-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">
        Loading Analytics...
      </h2>
      <p className="text-gray-500">
        Fetching data for {getDisplayName(advertiser)}
      </p>
    </div>
  );
};

export default LoadingState;
