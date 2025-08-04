

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Save } from "lucide-react";
import { DomainOrganizationWithExtraInfo } from "@/generated-api/src/models";
import { useTranslation } from "react-i18next";

interface OrganizationDetailsFormProps {
  organization: DomainOrganizationWithExtraInfo;
  formData: {
    name: string;
    type: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isSaving: boolean;
}

const OrganizationDetailsForm: React.FC<OrganizationDetailsFormProps> = ({
  organization,
  formData,
  onInputChange,
  onSave,
  isSaving,
}) => {
  const { t } = useTranslation();

  // Get the appropriate extra info based on organization type
  const extraInfo = organization.type === 'advertiser' 
    ? organization.advertiserExtraInfo 
    : organization.affiliateExtraInfo;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {t("organizations.organizationDetails")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("organizations.organizationName")}</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder={t("organizations.organizationName")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">{t("organizations.organizationType")}</Label>
          <Input
            id="type"
            name="type"
            value={formData.type}
            onChange={onInputChange}
            placeholder={t("organizations.organizationType")}
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label>{t("organizations.website")}</Label>
          <p className="text-sm text-muted-foreground">
            {extraInfo?.website || t("organizations.notProvided")}
          </p>
        </div>

        {/* Organization type specific fields */}
        {organization.type === 'advertiser' && organization.advertiserExtraInfo && (
          <>
            <div className="space-y-2">
              <Label>{t("organizations.companySize")}</Label>
              <p className="text-sm text-muted-foreground">
                {organization.advertiserExtraInfo.companySize || t("organizations.notProvided")}
              </p>
            </div>
            <div className="space-y-2">
              <Label>{t("organizations.websiteType")}</Label>
              <p className="text-sm text-muted-foreground">
                {organization.advertiserExtraInfo.websiteType || t("organizations.notProvided")}
              </p>
            </div>
          </>
        )}

        {organization.type === 'affiliate' && organization.affiliateExtraInfo && (
          <>
            <div className="space-y-2">
              <Label>{t("organizations.affiliateType")}</Label>
              <p className="text-sm text-muted-foreground">
                {organization.affiliateExtraInfo.affiliateType || t("organizations.notProvided")}
              </p>
            </div>
            <div className="space-y-2">
              <Label>{t("organizations.description")}</Label>
              <p className="text-sm text-muted-foreground">
                {organization.affiliateExtraInfo.selfDescription || t("organizations.notProvided")}
              </p>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>{t("organizations.created")}</Label>
          <p className="text-sm text-muted-foreground">
            {organization.createdAt ? new Date(organization.createdAt).toLocaleDateString() : t("organizations.statusUnknown")}
          </p>
        </div>
        
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Save className="w-4 h-4 mr-2 animate-pulse" />
              {t("organizations.saving")}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {t("common.saveChanges")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrganizationDetailsForm;

