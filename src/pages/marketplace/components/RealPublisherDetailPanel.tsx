import React from "react";
import { useTranslation } from "react-i18next";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ExternalLink, 
  Globe, 
  Star,
  MessageSquare,
  Mail,
  Users,
  TrendingUp,
  Tag,
  MapPin
} from "lucide-react";
import type { DomainAnalyticsPublisherResponse } from '@/generated-api/src/models';

interface RealPublisherDetailPanelProps {
  publisher: DomainAnalyticsPublisherResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

const RealPublisherDetailPanel: React.FC<RealPublisherDetailPanelProps> = ({
  publisher,
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  
  if (!publisher?.publisher) return null;
  
  const publisherData = publisher.publisher;
  const domain = publisherData.domain || "Unknown";
  const description = publisherData.metaData?.description || t("marketplace.noDescription");
  const faviconUrl = publisherData.metaData?.faviconImageUrl;
  const screenshotUrl = publisherData.metaData?.screenshotImageUrl;
  
  // Get country rankings
  const countryRankings = publisherData.countryRankings?.value || [];
  const primaryCountry = publisherData.countryRankings?.highestValue?.countryCode?.toUpperCase() || "Unknown";
  
  // Get verticals
  const verticals = publisherData.verticalsV2?.value || [];
  
  // Get keywords
  const keywords = publisherData.keywords?.sampleValue || [];
  
  // Get affiliate networks
  const affiliateNetworks = publisherData.affiliateNetworks?.value || [];
  
  // Get social media
  const socialMedia = publisherData.socialMedia?.value || {};
  const socialPlatforms = publisherData.socialMedia?.socialsAvailable || [];
  
  // Get partners info
  const partners = (publisherData.partners as any)?.value || [];
  const partnerInfo = publisherData.partnerInformation as any;
  const verticalMix = partnerInfo?.verticalMix?.value || [];
  
  // Calculate relevance score as rating
  const relevanceScore = publisherData.relevance || 0;
  const rating = Math.min(5, Math.max(0, relevanceScore * 5));
  
  const promoType = (publisherData.promotype as any)?.value || "Unknown";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center space-x-3">
            {faviconUrl ? (
              <img 
                src={faviconUrl} 
                alt={`${domain} favicon`}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Globe className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <SheetTitle className="text-xl">{domain}</SheetTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://${domain}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <Badge variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  {primaryCountry}
                </Badge>
                <Badge variant="secondary">
                  {promoType}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("marketplace.description")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>

          {/* Screenshot */}
          {screenshotUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("marketplace.websitePreview")}</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={screenshotUrl} 
                  alt={`${domain} screenshot`}
                  className="w-full rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Verticals */}
          {verticals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  {t("marketplace.verticals")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {verticals.map((vertical: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <Badge variant="secondary">{vertical.name}</Badge>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Score: {vertical.score}</span>
                        <span>Rank: #{vertical.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Affiliate Networks */}
          {affiliateNetworks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("marketplace.affiliateNetworks")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {affiliateNetworks.map((network: string, index: number) => (
                    <Badge key={index} variant="outline">{network}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Keywords */}
          {keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("marketplace.topKeywords")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {keywords.slice(0, 10).map((keyword: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{keyword.value}</span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(keyword.score * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Media */}
          {socialPlatforms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("marketplace.socialMedia")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {socialPlatforms.map((platform: string) => {
                    const url = socialMedia[platform];
                    return (
                      <div key={platform} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{platform}</span>
                        {url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Partners */}
          {partners.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {t("marketplace.partners")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {partners.slice(0, 5).map((partner: string, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{partner}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://${partner}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {partners.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      +{partners.length - 5} more partners
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Country Rankings */}
          {countryRankings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {t("marketplace.countryRankings")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {countryRankings.slice(0, 5).map((ranking: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <Badge variant="outline">{ranking.countryCode?.toUpperCase()}</Badge>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(ranking.score * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {(ranking.score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              {t("marketplace.requestPartnership")}
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              {t("marketplace.contact")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RealPublisherDetailPanel;