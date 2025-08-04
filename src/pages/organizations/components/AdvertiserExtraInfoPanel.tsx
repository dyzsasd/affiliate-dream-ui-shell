import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Globe, Users, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdvertiserExtraInfo {
  website?: string;
  websiteType?: string;
  companySize?: string;
}

interface AdvertiserExtraInfoPanelProps {
  extraInfo: AdvertiserExtraInfo;
  onDataChange?: (data: AdvertiserExtraInfo) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

const AdvertiserExtraInfoPanel: React.FC<AdvertiserExtraInfoPanelProps> = ({ 
  extraInfo, 
  onDataChange, 
  onSave, 
  isSaving = false 
}) => {
  const { t } = useTranslation();

  const handleInputChange = (field: keyof AdvertiserExtraInfo, value: string) => {
    if (onDataChange) {
      onDataChange({ ...extraInfo, [field]: value });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {t("organizations.advertiserInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t("organizations.website")}
          </Label>
          <Input
            value={extraInfo.website || ''}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder={t("organizations.websitePlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("organizations.websiteType")}</Label>
          <Select value={extraInfo.websiteType || ''} onValueChange={(value) => handleInputChange('websiteType', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("organizations.selectWebsiteType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shopify">Shopify</SelectItem>
              <SelectItem value="amazon">Amazon</SelectItem>
              <SelectItem value="shopline">Shopline</SelectItem>
              <SelectItem value="tiktok_shop">TikTok Shop</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t("organizations.companySize")}
          </Label>
          <Select value={extraInfo.companySize || ''} onValueChange={(value) => handleInputChange('companySize', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("organizations.selectCompanySize")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {onSave && (
          <Button 
            onClick={onSave} 
            disabled={isSaving}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? t("common.saving") : t("common.save")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvertiserExtraInfoPanel;