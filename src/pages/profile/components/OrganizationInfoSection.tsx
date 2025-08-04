

import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '@/contexts/auth/authTypes';
import { DomainProfile, DomainOrganizationWithExtraInfo } from '@/generated-api/src/models';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface OrganizationInfoSectionProps {
  profile: UserProfile | null;
  backendProfile: DomainProfile | null;
  organization: DomainOrganizationWithExtraInfo | null;
  isOrganizationLoading: boolean;
}

const OrganizationInfoSection: React.FC<OrganizationInfoSectionProps> = ({ 
  profile, 
  backendProfile,
  organization,
  isOrganizationLoading
}) => {
  const { t } = useTranslation();

  // Derive organization ID from various sources - fixed to use organizationId instead of id
  const organizationId = organization?.organizationId || 
                         profile?.organization?.id || 
                         backendProfile?.organizationId;

  // Get the appropriate extra info based on organization type
  const extraInfo = organization?.type === 'advertiser' 
    ? organization.advertiserExtraInfo 
    : organization?.affiliateExtraInfo;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{t("profile.organizationInfo")}</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        <dt className="text-sm font-medium text-muted-foreground">{t("profile.organization")}</dt>
        <dd className="text-sm flex items-center gap-2">
          {isOrganizationLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              {organization?.name || profile?.organization?.name || 
               (backendProfile?.organizationId ? (
                 <>
                   <span>ID: {backendProfile.organizationId}</span>
                 </>
               ) : t("profile.notAssigned"))}
            </>
          )}
        </dd>
        
        <dt className="text-sm font-medium text-muted-foreground">ID</dt>
        <dd className="text-sm">
          {organizationId || t("profile.notAssigned")}
        </dd>
        
        <dt className="text-sm font-medium text-muted-foreground">{t("profile.role")}</dt>
        <dd className="text-sm">
          {profile?.role?.name || 
           (backendProfile?.roleId ? `Role ID: ${backendProfile.roleId}` : t("profile.notAssigned"))}
        </dd>

        {/* Website */}
        <dt className="text-sm font-medium text-muted-foreground">{t("organizations.website")}</dt>
        <dd className="text-sm">
          {extraInfo?.website || t("profile.notAssigned")}
        </dd>

        {/* Company Size for Advertisers */}
        {organization?.type === 'advertiser' && organization.advertiserExtraInfo && (
          <>
            <dt className="text-sm font-medium text-muted-foreground">{t("organizations.companySize")}</dt>
            <dd className="text-sm">
              {organization.advertiserExtraInfo.companySize || t("profile.notAssigned")}
            </dd>
          </>
        )}

        {/* Affiliate Type for Affiliates */}
        {organization?.type === 'affiliate' && organization.affiliateExtraInfo && (
          <>
            <dt className="text-sm font-medium text-muted-foreground">{t("organizations.affiliateType")}</dt>
            <dd className="text-sm">
              {organization.affiliateExtraInfo.affiliateType || t("profile.notAssigned")}
            </dd>
          </>
        )}
      </dl>
    </div>
  );
};

export default OrganizationInfoSection;

