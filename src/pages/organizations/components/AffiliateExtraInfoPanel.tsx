import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AffiliateExtraInfo {
  website?: string;
  affiliateType?: string;
  selfDescription?: string;
}

interface AffiliateExtraInfoPanelProps {
  extraInfo: AffiliateExtraInfo;
}

const AffiliateExtraInfoPanel: React.FC<AffiliateExtraInfoPanelProps> = ({ extraInfo }) => {
  const { t } = useTranslation();

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
          <p className="text-sm text-muted-foreground">
            {extraInfo.website || t("organizations.notProvided")}
          </p>
        </div>

        <div className="space-y-2">
          <Label>{t("organizations.affiliateType")}</Label>
          <div>
            {extraInfo.affiliateType ? (
              <Badge variant="secondary">{extraInfo.affiliateType}</Badge>
            ) : (
              <p className="text-sm text-muted-foreground">{t("organizations.notProvided")}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t("organizations.description")}
          </Label>
          <p className="text-sm text-muted-foreground">
            {extraInfo.selfDescription || t("organizations.notProvided")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffiliateExtraInfoPanel;