
import React from 'react';
import { DomainProfile } from '@/generated-api/src/models';

interface BackendProfileDataProps {
  backendProfile: DomainProfile | null;
}

const BackendProfileData: React.FC<BackendProfileDataProps> = ({ backendProfile }) => {
  if (!backendProfile) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Backend Profile Data</h3>
      <div className="bg-muted p-3 rounded-md overflow-auto max-h-80">
        <pre className="text-xs">{JSON.stringify(backendProfile, null, 2)}</pre>
      </div>
    </div>
  );
};

export default BackendProfileData;
