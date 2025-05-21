
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '@/contexts/auth/authTypes';
import { DomainProfile } from '@/generated-api/src/models';

interface OrganizationInfoSectionProps {
  profile: UserProfile | null;
  backendProfile: DomainProfile | null;
}

const OrganizationInfoSection: React.FC<OrganizationInfoSectionProps> = ({ 
  profile, 
  backendProfile 
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{t("profile.organizationInfo")}</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        <dt className="text-sm font-medium text-muted-foreground">{t("profile.organization")}</dt>
        <dd className="text-sm">
          {profile?.organization?.name || 
           (backendProfile?.organizationId ? `Organization ID: ${backendProfile.organizationId}` : t("profile.notAssigned"))}
        </dd>
        
        <dt className="text-sm font-medium text-muted-foreground">{t("profile.role")}</dt>
        <dd className="text-sm">
          {profile?.role?.name || 
           (backendProfile?.roleId ? `Role ID: ${backendProfile.roleId}` : '-')}
        </dd>
      </dl>
    </div>
  );
};

export default OrganizationInfoSection;
