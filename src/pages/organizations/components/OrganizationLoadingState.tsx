
import React from "react";
import { useTranslation } from "react-i18next";

const OrganizationLoadingState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-affiliate-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">{t("common.loading")}</p>
      </div>
    </div>
  );
};

export default OrganizationLoadingState;
