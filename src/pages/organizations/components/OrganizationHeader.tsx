
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2 } from "lucide-react";
import { DomainOrganizationWithExtraInfo } from "@/generated-api/src/models";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "@/components/common/LanguageSelector";

interface OrganizationHeaderProps {
  organization: DomainOrganizationWithExtraInfo;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({ organization }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/organizations')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back")}
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("organizations.editOrganization")}</h1>
          <p className="text-muted-foreground">
            {t("organizations.editDescription")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <Badge variant="outline" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          ID: {organization.organizationId}
        </Badge>
      </div>
    </div>
  );
};

export default OrganizationHeader;
