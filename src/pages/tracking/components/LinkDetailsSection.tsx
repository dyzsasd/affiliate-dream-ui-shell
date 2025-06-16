
import React from "react";
import { useTranslation } from "react-i18next";

interface LinkDetailsSectionProps {
  campaignName: string;
  affiliateName: string;
  sub1?: string;
  sub2?: string;
  sub3?: string;
  deepLink?: string;
}

const LinkDetailsSection: React.FC<LinkDetailsSectionProps> = ({
  campaignName,
  affiliateName,
  sub1,
  sub2,
  sub3,
  deepLink,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{t("trackingLinks.linkDetails")}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-500">{t("trackingLinks.campaign")}:</div>
        <div>{campaignName}</div>
        
        <div className="text-gray-500">{t("trackingLinks.affiliate")}:</div>
        <div>{affiliateName}</div>
        
        {sub1 && (
          <>
            <div className="text-gray-500">{t("trackingLinks.subId1")}:</div>
            <div>{sub1}</div>
          </>
        )}
        
        {sub2 && (
          <>
            <div className="text-gray-500">{t("trackingLinks.subId2")}:</div>
            <div>{sub2}</div>
          </>
        )}
        
        {sub3 && (
          <>
            <div className="text-gray-500">{t("trackingLinks.subId3")}:</div>
            <div>{sub3}</div>
          </>
        )}
        
        {deepLink && (
          <>
            <div className="text-gray-500">{t("trackingLinks.deepLink")}:</div>
            <div className="truncate">{deepLink}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default LinkDetailsSection;
