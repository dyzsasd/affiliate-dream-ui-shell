import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { OrganizationsApi } from '@/generated-api/src/apis';
import { DomainOrganizationWithExtraInfo } from '@/generated-api/src/models';
import { createApiClient } from '@/services/backendApi';
import { ArrowLeft } from 'lucide-react';
import { InviteUserSection } from '@/components/organization/InviteUserSection';
import BasicInfoPanel from './components/BasicInfoPanel';
import AdvertiserExtraInfoPanel from '../organizations/components/AdvertiserExtraInfoPanel';
import AffiliateExtraInfoPanel from '../organizations/components/AffiliateExtraInfoPanel';
import OrganizationHeader from '../organizations/components/OrganizationHeader';
import OrganizationLoadingState from '../organizations/components/OrganizationLoadingState';
import OrganizationNotFound from '../organizations/components/OrganizationNotFound';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface BasicInfoData {
  name: string;
  description?: string;
  contactEmail?: string;
}

export const OrganizationEdit: React.FC = () => {
  const { organization } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [organizationData, setOrganizationData] = useState<DomainOrganizationWithExtraInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [basicInfoData, setBasicInfoData] = useState<BasicInfoData>({
    name: "",
    description: "",
    contactEmail: ""
  });
  const [advertiserData, setAdvertiserData] = useState<{website?: string; websiteType?: string; companySize?: string}>({
    website: "",
    websiteType: "",
    companySize: ""
  });
  const [affiliateData, setAffiliateData] = useState<{website?: string; affiliateType?: string; selfDescription?: string}>({
    website: "",
    affiliateType: "",
    selfDescription: ""
  });

  useEffect(() => {
    if (organization?.organizationId) {
      fetchOrganizationWithExtraInfo();
    }
  }, [organization]);

  const fetchOrganizationWithExtraInfo = async () => {
    if (!organization?.organizationId) return;
    
    try {
      setIsLoading(true);
      const organizationsApi = await createApiClient(OrganizationsApi);
      const rawData = await organizationsApi.organizationsIdGet({
        id: organization.organizationId,
        withExtra: true
      }) as any;
      
      // Map snake_case response to camelCase for TypeScript interface
      console.log('🔍 Raw API response:', rawData);
      console.log('🔍 Raw advertiser_extra_info:', rawData.advertiser_extra_info);
      console.log('🔍 Raw affiliate_extra_info:', rawData.affiliate_extra_info);
      
      const mappedData: DomainOrganizationWithExtraInfo = {
        organizationId: rawData.organizationId,
        name: rawData.name,
        type: rawData.type,
        createdAt: rawData.createdAt,
        updatedAt: rawData.updatedAt,
        advertiserExtraInfo: rawData.advertiserExtraInfo ? {
          website: rawData.advertiserExtraInfo.website,
          websiteType: rawData.advertiserExtraInfo.websiteType,
          companySize: rawData.advertiserExtraInfo.companySize
        } : undefined,
        affiliateExtraInfo: rawData.affiliateExtraInfo ? {
          website: rawData.affiliateExtraInfo.website,
          affiliateType: rawData.affiliateExtraInfo.affiliateType,
          selfDescription: rawData.affiliateExtraInfo.selfDescription
        } : undefined
      };
      
      console.log('✅ Mapped organization data:', mappedData);
      console.log('✅ Mapped advertiserExtraInfo:', mappedData.advertiserExtraInfo);
      console.log('✅ Mapped affiliateExtraInfo:', mappedData.affiliateExtraInfo);
      console.log('✅ Organization type:', mappedData.type);
      
      setOrganizationData(mappedData);
      setBasicInfoData({
        name: mappedData.name || "",
        description: "", // Not available in current API
        contactEmail: "" // Not available in current API
      });
      
      // Initialize extra info data
      if (mappedData.advertiserExtraInfo) {
        setAdvertiserData({
          website: mappedData.advertiserExtraInfo.website || "",
          websiteType: mappedData.advertiserExtraInfo.websiteType || "",
          companySize: mappedData.advertiserExtraInfo.companySize || ""
        });
      }
      
      if (mappedData.affiliateExtraInfo) {
        setAffiliateData({
          website: mappedData.affiliateExtraInfo.website || "",
          affiliateType: mappedData.affiliateExtraInfo.affiliateType || "",
          selfDescription: mappedData.affiliateExtraInfo.selfDescription || ""
        });
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
      toast({
        title: t("common.error"),
        description: t("organizations.fetchError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBasicInfoSave = async () => {
    if (!organizationData?.organizationId) return;

    try {
      setIsSaving(true);
      const organizationsApi = await createApiClient(OrganizationsApi);
      await organizationsApi.organizationsIdPut({
        id: organizationData.organizationId,
        request: {
          name: basicInfoData.name,
          type: organizationData.type as any
        }
      });
      
      // Update local state
      setOrganizationData(prev => prev ? { ...prev, name: basicInfoData.name } : null);
      
      toast({
        title: t("common.success"),
        description: t("organizations.updateSuccess"),
      });
    } catch (error) {
      console.error('Error updating basic info:', error);
      toast({
        title: t("common.error"),
        description: t("organizations.updateError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdvertiserSave = async () => {
    if (!organizationData?.organizationId) return;

    try {
      setIsSaving(true);
      const organizationsApi = await createApiClient(OrganizationsApi);
      // Note: You may need to implement the API endpoint for updating advertiser extra info
      await organizationsApi.organizationsIdPut({
        id: organizationData.organizationId,
        request: {
          name: organizationData.name!,
          type: organizationData.type as any,
          advertiserExtraInfo: {
            website: advertiserData.website,
            websiteType: advertiserData.websiteType as any,
            companySize: advertiserData.companySize as any
          }
        }
      });
      
      toast({
        title: t("common.success"),
        description: t("organizations.updateSuccess"),
      });
    } catch (error) {
      console.error('Error updating advertiser info:', error);
      toast({
        title: t("common.error"),
        description: t("organizations.updateError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAffiliateSave = async () => {
    if (!organizationData?.organizationId) return;

    try {
      setIsSaving(true);
      const organizationsApi = await createApiClient(OrganizationsApi);
      // Note: You may need to implement the API endpoint for updating affiliate extra info
      await organizationsApi.organizationsIdPut({
        id: organizationData.organizationId,
        request: {
          name: organizationData.name!,
          type: organizationData.type as any,
          affiliateExtraInfo: {
            website: affiliateData.website,
            affiliateType: affiliateData.affiliateType as any,
            selfDescription: affiliateData.selfDescription
          }
        }
      });
      
      toast({
        title: t("common.success"),
        description: t("organizations.updateSuccess"),
      });
    } catch (error) {
      console.error('Error updating affiliate info:', error);
      toast({
        title: t("common.error"),
        description: t("organizations.updateError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <OrganizationLoadingState />;
  }

  if (!organizationData) {
    return <OrganizationNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
        </div>

        <OrganizationHeader organization={organizationData} />

        {/* Basic Info Panel */}
        <BasicInfoPanel
          data={basicInfoData}
          onDataChange={setBasicInfoData}
          onSave={handleBasicInfoSave}
          isSaving={isSaving}
        />

        {/* Extra Info Panels - Only show if data exists */}
        {organizationData.type === 'advertiser' && organizationData.advertiserExtraInfo && (
          <AdvertiserExtraInfoPanel 
            extraInfo={advertiserData}
            onDataChange={setAdvertiserData}
            onSave={handleAdvertiserSave}
            isSaving={isSaving}
          />
        )}
        
        {organizationData.type === 'affiliate' && organizationData.affiliateExtraInfo && (
          <AffiliateExtraInfoPanel 
            extraInfo={affiliateData}
            onDataChange={setAffiliateData}
            onSave={handleAffiliateSave}
            isSaving={isSaving}
          />
        )}

        {/* Invite Team Member - At the bottom */}
        <InviteUserSection
          organizationId={organizationData.organizationId!}
          organizationName={organizationData.name || 'Organization'}
        />
      </div>
    </div>
  );
};

export default OrganizationEdit;