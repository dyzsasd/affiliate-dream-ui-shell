import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Star, 
  Globe, 
  Eye,
  MessageSquare,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DomainAnalyticsPublisherResponse } from '@/generated-api/src/models';

interface RealPublisherCardProps {
  publisher: DomainAnalyticsPublisherResponse;
  viewMode: "grid" | "list";
  onViewDetails: () => void;
}

const RealPublisherCard: React.FC<RealPublisherCardProps> = ({
  publisher,
  viewMode,
  onViewDetails
}) => {
  const { t } = useTranslation();
  
  const publisherData = publisher.publisher;
  if (!publisherData) return null;

  const domain = publisherData.domain || "Unknown";
  const description = publisherData.metaData?.description || t("marketplace.noDescription");
  const faviconUrl = publisherData.metaData?.faviconImageUrl;
  const screenshotUrl = publisherData.metaData?.screenshotImageUrl;
  
  // Get primary country
  const primaryCountry = publisherData.countryRankings?.highestValue?.countryCode?.toUpperCase() || "Unknown";
  
  // Get primary vertical
  const primaryVertical = publisherData.verticalsV2?.sampleValue?.name || 
                         publisherData.verticalsV2?.value?.[0]?.name || 
                         "Uncategorized";
  
  // Get affiliate networks
  const affiliateNetworks = publisherData.affiliateNetworks?.sampleValue || [];
  
  // Get social media platforms
  const socialPlatforms = publisherData.socialMedia?.socialsAvailable || [];
  
  // Calculate relevance score as rating
  const relevanceScore = publisherData.relevance || 0;
  const rating = Math.min(5, Math.max(0, relevanceScore * 5));

  const isListView = viewMode === "list";

  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow cursor-pointer",
      isListView && "flex-row p-4"
    )}>
      <div className={cn(
        "flex",
        isListView ? "flex-row items-center space-x-4 w-full" : "flex-col"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center space-x-3",
          isListView ? "flex-shrink-0" : "p-4 pb-2"
        )}>
          {faviconUrl ? (
            <img 
              src={faviconUrl} 
              alt={`${domain} favicon`}
              className="w-10 h-10 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm truncate">{domain}</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://${domain}`, '_blank');
                }}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">
                  {rating.toFixed(1)}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {primaryCountry}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "flex-1",
          isListView ? "min-w-0" : "px-4"
        )}>
          <p className={cn(
            "text-sm text-muted-foreground line-clamp-2",
            isListView && "line-clamp-1"
          )}>
            {description}
          </p>
          
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {primaryVertical}
              </Badge>
              {affiliateNetworks.slice(0, 2).map((network: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {network}
                </Badge>
              ))}
            </div>
            
            {socialPlatforms.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">
                  {t("marketplace.socialPlatforms")}:
                </span>
                <div className="flex space-x-1">
                  {socialPlatforms.slice(0, 3).map((platform: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                  {socialPlatforms.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{socialPlatforms.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={cn(
          "flex items-center justify-between gap-2",
          isListView ? "flex-shrink-0" : "p-4 pt-2"
        )}>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              {t("marketplace.viewDetails")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement contact functionality
              }}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {t("marketplace.contact")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RealPublisherCard;