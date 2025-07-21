import React from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type { DomainAnalyticsPublisherResponsePublisher } from '@/generated-api/src/models';

interface PublisherDetailsProps {
  publisherData: DomainAnalyticsPublisherResponsePublisher;
}

const PublisherDetails: React.FC<PublisherDetailsProps> = ({ publisherData }) => {
  const { t } = useTranslation();

  const description = publisherData.metaData?.description || t("marketplace.noDescription");

  return (
    <div className="space-y-4 lg:col-span-1">
      <div>
        <h3 className="font-semibold text-lg mb-2">
          {publisherData.promotype?.value || t("marketplace.website")}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </div>


      {/* Top Keywords */}
      {publisherData.keywords?.sampleValue && publisherData.keywords.sampleValue.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">{t("marketplace.topKeywords")}</h4>
          <div className="flex flex-wrap gap-1">
            {publisherData.keywords.sampleValue.slice(0, 4).map((keyword: any, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {keyword.value}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublisherDetails;