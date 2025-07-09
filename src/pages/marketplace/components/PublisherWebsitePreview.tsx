import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, Users, Star, Eye, Mail } from "lucide-react";
import type { DomainAnalyticsPublisherResponsePublisher } from '@/generated-api/src/models';

interface PublisherWebsitePreviewProps {
  publisherData: DomainAnalyticsPublisherResponsePublisher;
  onViewDetails: () => void;
  onContact: () => void;
}

const PublisherWebsitePreview: React.FC<PublisherWebsitePreviewProps> = ({
  publisherData,
  onViewDetails,
  onContact
}) => {
  const { t } = useTranslation();

  const domain = publisherData.domain || "Unknown";
  const screenshotUrl = publisherData.metaData?.screenshotImageUrl;
  const faviconUrl = publisherData.metaData?.faviconImageUrl;
  
  // Get country from rankings
  const topCountry = publisherData.countryRankings?.highestValue?.countryCode?.toUpperCase();
  
  // Get partners count
  const partnersCount = (publisherData.partners as any)?.count || 0;
  
  // Get keywords count
  const keywordsCount = (publisherData.keywords as any)?.count || 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        {screenshotUrl ? (
          <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted">
            <img 
              src={screenshotUrl} 
              alt={`${domain} screenshot`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="aspect-[4/3] rounded-lg border bg-muted flex items-center justify-center">
            <Globe className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {faviconUrl && (
          <img 
            src={faviconUrl} 
            alt={`${domain} favicon`}
            className="w-6 h-6 rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}
        <div className="flex items-center gap-2">
          <span className="font-medium">{domain}</span>
          {topCountry && (
            <Badge variant="outline" className="text-xs">
              {topCountry}
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => window.open(`https://${domain}`, '_blank')}
          className="p-1 h-auto"
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          <span>{keywordsCount}</span>
          <span className="text-xs">Keywords</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{partnersCount}</span>
          <span className="text-xs">Partners</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          <Eye className="h-3 w-3 mr-1" />
          {t("marketplace.viewDetails")}
        </Button>
        <Button variant="default" size="sm" onClick={onContact}>
          <Mail className="h-3 w-3 mr-1" />
          Contact
        </Button>
      </div>
    </div>
  );
};

export default PublisherWebsitePreview;