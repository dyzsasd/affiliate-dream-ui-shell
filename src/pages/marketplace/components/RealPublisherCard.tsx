import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, Users, Star, Eye, Mail } from "lucide-react";
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
  const screenshotUrl = publisherData.metaData?.screenshotImageUrl;
  const faviconUrl = publisherData.metaData?.faviconImageUrl;
  
  // Get country from rankings
  const topCountry = publisherData.countryRankings?.highestValue?.countryCode?.toUpperCase();
  
  // Get top verticals
  const topVerticals = publisherData.verticalsV2?.value?.slice(0, 5) || [];
  
  // Get affiliate networks
  const affiliateNetworks = publisherData.affiliateNetworks?.value || [];
  
  // Get partners count
  const partnersCount = (publisherData.partners as any)?.count || 0;
  
  // Get keywords count
  const keywordsCount = (publisherData.keywords as any)?.count || 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Section - Website Preview */}
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
              <Button variant="default" size="sm">
                <Mail className="h-3 w-3 mr-1" />
                Contact
              </Button>
            </div>
          </div>

          {/* Middle Section - Details */}
          <div className="space-y-4 lg:col-span-1">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {publisherData.promotype?.value || "Website"}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {description}
              </p>
            </div>

            {/* Affiliate Networks */}
            {affiliateNetworks.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">{t("marketplace.affiliateNetworks")}</h4>
                <div className="flex flex-wrap gap-1">
                  {affiliateNetworks.slice(0, 3).map((network, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {network}
                    </Badge>
                  ))}
                  {affiliateNetworks.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{affiliateNetworks.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

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

          {/* Right Section - Vertical Mix & Metrics */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-3">Vertical Mix</h4>
              
              {/* Vertical Progress Bar */}
              {topVerticals.length > 0 && (
                <div className="space-y-3">
                  <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                    {topVerticals.map((vertical: any, index: number) => {
                      const colors = [
                        'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                        'bg-purple-500', 'bg-pink-500'
                      ];
                      const width = Math.max(15, (vertical.score || 20) / 2); // Ensure minimum width
                      
                      return (
                        <div
                          key={index}
                          className={`${colors[index % colors.length]} transition-all duration-300`}
                          style={{ width: `${width}%` }}
                        />
                      );
                    })}
                  </div>
                  
                  <div className="space-y-1">
                    {topVerticals.map((vertical: any, index: number) => {
                      const colors = [
                        'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                        'bg-purple-500', 'bg-pink-500'
                      ];
                      
                      return (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${colors[index % colors.length]}`} />
                          <span className="text-muted-foreground flex-1 truncate">
                            {vertical.name}
                          </span>
                          <span className="font-medium">{vertical.score}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="font-semibold text-blue-600">
                  {publisherData.trafficScore || 0}
                </div>
                <div className="text-xs text-muted-foreground">Traffic Score</div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="font-semibold text-green-600">
                  {publisherData.relevance || 0}
                </div>
                <div className="text-xs text-muted-foreground">Relevance</div>
              </div>
            </div>

            {/* Social Media */}
            {publisherData.socialMedia?.value && (
              <div>
                <h4 className="font-medium text-sm mb-2">{t("marketplace.socialPlatforms")}</h4>
                <div className="flex gap-2">
                  {Object.keys(publisherData.socialMedia.value).slice(0, 4).map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs capitalize">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealPublisherCard;