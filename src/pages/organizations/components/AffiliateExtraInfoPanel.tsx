import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Globe, FileText, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AffiliateExtraInfo {
  website?: string;
  affiliateType?: string;
  selfDescription?: string;
}

interface AffiliateExtraInfoPanelProps {
  extraInfo: AffiliateExtraInfo;
  onDataChange?: (data: AffiliateExtraInfo) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

const AffiliateExtraInfoPanel: React.FC<AffiliateExtraInfoPanelProps> = ({ 
  extraInfo, 
  onDataChange, 
  onSave, 
  isSaving = false 
}) => {
  const { t } = useTranslation();

  const handleInputChange = (field: keyof AffiliateExtraInfo, value: string) => {
    if (onDataChange) {
      onDataChange({ ...extraInfo, [field]: value });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {t("organizations.affiliateInfo")}
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
          <Label>{t("organizations.affiliateType")}</Label>
          <Select value={extraInfo.affiliateType || ''} onValueChange={(value) => handleInputChange('affiliateType', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("organizations.selectAffiliateType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="influencer">Influencer</SelectItem>
              <SelectItem value="blogger">Blogger</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="coupon">Coupon Site</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t("organizations.description")}
          </Label>
          <Textarea
            value={extraInfo.selfDescription || ''}
            onChange={(e) => handleInputChange('selfDescription', e.target.value)}
            placeholder={t("organizations.descriptionPlaceholder")}
            rows={3}
          />
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

export default AffiliateExtraInfoPanel;