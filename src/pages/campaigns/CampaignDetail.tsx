import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  PauseCircle,
  FileEdit,
  Clock,
  Calendar,
  Link2,
  DollarSign,
  Eye,
  Globe,
  Target,
  Settings,
  BarChart3,
} from "lucide-react";
import { campaignService } from "@/services/campaign";
import { CampaignDetail as CampaignDetailType, Offer } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<CampaignDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) {
        console.error('No campaign ID provided in URL');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log(`Fetching campaign detail for ID: ${id}`);
        const campaignData = await campaignService.getCampaign(id);
        console.log('Campaign detail fetched:', campaignData);
        setCampaign(campaignData);
      } catch (error) {
        console.error("Error fetching campaign detail:", error);
        toast({
          title: t("common.error"),
          description: t("campaignDetail.errorFetchingCampaign"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, toast, t]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            {t("campaignDetail.statusActive")}
          </Badge>
        );
      case "paused":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <PauseCircle className="mr-1 h-3 w-3" />
            {t("campaignDetail.statusPaused")}
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <FileEdit className="mr-1 h-3 w-3" />
            {t("campaignDetail.statusDraft")}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getVisibilityBadge = (visibility?: string) => {
    if (!visibility) return null;
    
    const isPublic = visibility === "public";
    return (
      <Badge variant="outline" className={`${isPublic ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-700 border-gray-200"}`}>
        {isPublic ? <Globe className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
        {t(isPublic ? "campaignDetail.visibilityPublic" : "campaignDetail.visibilityPrivate")}
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("campaignDetail.noDate");
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined) return t("campaignDetail.notSet");
    return `${currency || "USD"} ${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-affiliate-primary" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-xl font-semibold mb-2">{t("campaignDetail.campaignNotFound")}</h2>
        <p className="text-gray-500 mb-4">{t("campaignDetail.campaignNotFoundDescription")}</p>
        <Link to="/campaigns">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("campaignDetail.backToCampaigns")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <Link to="/campaigns">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
        {getStatusBadge(campaign.status)}
        {getVisibilityBadge(campaign.visibility)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t("campaignDetail.basicInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t("campaigns.description")}</h3>
                  <p className="mt-1">{campaign.description || t("campaignDetail.noDescription")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.campaignId")}</h3>
                    <p className="mt-1 font-mono text-sm">{campaign.campaignId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.advertiserId")}</h3>
                    <p className="mt-1 font-mono text-sm">{campaign.advertiserId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.campaignPeriod")}</h3>
                    <div className="mt-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <p>
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.created")}</h3>
                    <div className="mt-1 flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <p>{new Date(campaign.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {campaign.destinationUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.destinationUrl")}</h3>
                    <a href={campaign.destinationUrl} target="_blank" rel="noopener noreferrer" 
                       className="mt-1 text-blue-600 hover:text-blue-800 break-all">
                      {campaign.destinationUrl}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payout & Revenue Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {t("campaignDetail.payoutRevenue")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-700">{t("campaignDetail.payoutInformation")}</h4>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.payoutType")}</h3>
                    <p className="mt-1 uppercase">{campaign.payoutType || t("campaignDetail.notSet")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.payoutAmount")}</h3>
                    <p className="mt-1 font-semibold">{formatCurrency(campaign.payoutAmount, campaign.currencyId)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-700">{t("campaignDetail.revenueInformation")}</h4>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.revenueType")}</h3>
                    <p className="mt-1 uppercase">{campaign.revenueType || t("campaignDetail.notSet")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.revenueAmount")}</h3>
                    <p className="mt-1 font-semibold">{formatCurrency(campaign.revenueAmount, campaign.currencyId)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking & Conversion */}
          {(campaign.conversionMethod || campaign.sessionDefinition || campaign.sessionDuration) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t("campaignDetail.trackingConversion")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.conversionMethod && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.conversionMethod")}</h3>
                      <p className="mt-1">{campaign.conversionMethod}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {campaign.sessionDefinition && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.sessionDefinition")}</h3>
                        <p className="mt-1">{campaign.sessionDefinition}</p>
                      </div>
                    )}
                    {campaign.sessionDuration && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.sessionDuration")}</h3>
                        <p className="mt-1">{campaign.sessionDuration} {t("campaignDetail.minutes")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          {(campaign.termsAndConditions || campaign.internalNotes) && (
            <Card>
              <CardHeader>
                <CardTitle>{t("campaignDetail.additionalInformation")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.termsAndConditions && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.termsAndConditions")}</h3>
                      <p className="mt-1 text-sm">{campaign.termsAndConditions}</p>
                    </div>
                  )}
                  {campaign.internalNotes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t("campaignDetail.internalNotes")}</h3>
                      <p className="mt-1 text-sm text-gray-600">{campaign.internalNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Provider Offers */}
          {campaign.offers && campaign.offers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("campaignDetail.providerOffers")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.offers.map((offer: Offer) => (
                    <div
                      key={offer.id}
                      className="p-4 border border-gray-200 rounded-md hover:border-affiliate-primary transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{offer.name}</h4>
                          <p className="text-sm text-gray-500">{offer.description}</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            offer.payoutType === "CPA"
                              ? "bg-blue-50 text-blue-700"
                              : offer.payoutType === "RevShare"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {offer.payoutType}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-500">{t("campaignDetail.payout")}:</span>{" "}
                          <span className="font-medium">
                            ${offer.payoutAmount.toFixed(2)} {offer.payoutType === "RevShare" && "%"}
                          </span>
                        </div>
                        <Link to={`/tracking-links?offerId=${offer.id}`}>
                          <Button size="sm" variant="outline" className="h-8">
                            <Link2 className="mr-1 h-4 w-4" />
                            {t("campaignDetail.generateLink")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t("campaignDetail.performanceOverview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t("campaignDetail.clicks")}</span>
                  <span className="font-medium">1,245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t("campaignDetail.conversions")}</span>
                  <span className="font-medium">32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t("campaignDetail.conversionRate")}</span>
                  <span className="font-medium">2.57%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">{t("campaignDetail.revenue")}</span>
                  <span className="font-medium">$645.00</span>
                </div>

                <Separator className="my-2" />

                <Link to="/reporting">
                  <Button variant="outline" className="w-full">
                    {t("campaignDetail.viewFullReport")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("campaignDetail.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to={`/tracking-links?campaignId=${campaign.campaignId}`}>
                  <Button className="w-full bg-affiliate-primary hover:bg-affiliate-primary/90">
                    {t("campaignDetail.generateTrackingLink")}
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  {t("campaignDetail.editCampaign")}
                </Button>
                {campaign.status === "active" ? (
                  <Button variant="outline" className="w-full text-yellow-600">
                    <PauseCircle className="mr-2 h-4 w-4" />
                    {t("campaignDetail.pauseCampaign")}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full text-green-600">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t("campaignDetail.activateCampaign")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Campaign URLs */}
          {(campaign.previewUrl || campaign.thumbnailUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>{t("campaignDetail.campaignAssets")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {campaign.previewUrl && (
                    <a href={campaign.previewUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        {t("campaignDetail.viewPreview")}
                      </Button>
                    </a>
                  )}
                  {campaign.thumbnailUrl && (
                    <a href={campaign.thumbnailUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        {t("campaignDetail.viewThumbnail")}
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
