
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile } from '@/contexts/auth/authTypes';
import { DomainProfile, DomainOrganization } from '@/generated-api/src/models';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface OrganizationInfoSectionProps {
  profile: UserProfile | null;
  backendProfile: DomainProfile | null;
  organization: DomainOrganization | null;
  isOrganizationLoading: boolean;
}

const OrganizationInfoSection: React.FC<OrganizationInfoSectionProps> = ({ 
  profile, 
  backendProfile,
  organization,
  isOrganizationLoading
}) => {
  const { t } = useTranslation();

  // Derive organization ID from various sources
  const organizationId = organization?.id || 
                         profile?.organization?.id || 
                         backendProfile?.organizationId;

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
                   {organization?.status && (
                     <Badge variant={organization.status === 'active' ? 'default' : 'outline'}>
                       {organization.status}
                     </Badge>
                   )}
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
      </dl>
    </div>
  );
};

export default OrganizationInfoSection;
