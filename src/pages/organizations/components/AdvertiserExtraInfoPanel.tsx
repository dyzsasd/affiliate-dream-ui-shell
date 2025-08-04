import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdvertiserExtraInfo {
  website?: string;
  websiteType?: string;
  companySize?: string;
}

interface AdvertiserExtraInfoPanelProps {
  extraInfo: AdvertiserExtraInfo;
}

const AdvertiserExtraInfoPanel: React.FC<AdvertiserExtraInfoPanelProps> = ({ extraInfo }) => {
  const { t } = useTranslation();
  
  console.log('AdvertiserExtraInfoPanel received extraInfo:', extraInfo);

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
          <p className="text-sm text-muted-foreground">
            {extraInfo.website || t("organizations.notProvided")}
          </p>
        </div>

        <div className="space-y-2">
          <Label>{t("organizations.websiteType")}</Label>
          <div>
            {extraInfo.websiteType ? (
              <Badge variant="secondary">{extraInfo.websiteType}</Badge>
            ) : (
              <p className="text-sm text-muted-foreground">{t("organizations.notProvided")}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t("organizations.companySize")}
          </Label>
          <div>
            {extraInfo.companySize ? (
              <Badge variant="outline">{extraInfo.companySize}</Badge>
            ) : (
              <p className="text-sm text-muted-foreground">{t("organizations.notProvided")}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvertiserExtraInfoPanel;