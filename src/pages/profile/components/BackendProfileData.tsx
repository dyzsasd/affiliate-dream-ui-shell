
import React from 'react';
import { DomainProfile, DomainOrganization } from '@/generated-api/src/models';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BackendProfileDataProps {
  backendProfile: DomainProfile | null;
  organization?: DomainOrganization | null;
}

const BackendProfileData: React.FC<BackendProfileDataProps> = ({ 
  backendProfile,
  organization 
}) => {
  if (!backendProfile) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Backend Profile Data</h3>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {organization && <TabsTrigger value="organization">Organization</TabsTrigger>}
        </TabsList>
        <TabsContent value="profile" className="mt-2">
          <div className="bg-muted p-3 rounded-md overflow-auto max-h-80">
            <pre className="text-xs">{JSON.stringify(backendProfile, null, 2)}</pre>
          </div>
        </TabsContent>
        {organization && (
          <TabsContent value="organization" className="mt-2">
            <div className="bg-muted p-3 rounded-md overflow-auto max-h-80">
              <pre className="text-xs">{JSON.stringify(organization, null, 2)}</pre>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default BackendProfileData;
