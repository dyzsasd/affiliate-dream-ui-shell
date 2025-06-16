
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { mockCampaigns } from "@/services/api";
import { Copy, Link, LinkIcon, Loader2 } from "lucide-react";

// Mock affiliates data
const mockAffiliates = [
  {
    id: "1",
    name: "Digital Marketing Pro",
    email: "contact@digitalmarketingpro.com",
    status: "active"
  },
  {
    id: "2", 
    name: "Performance Network",
    email: "partners@performancenetwork.com",
    status: "active"
  },
  {
    id: "3",
    name: "Global Affiliates Inc",
    email: "team@globalaffiliates.com", 
    status: "active"
  },
  {
    id: "4",
    name: "Traffic Masters",
    email: "hello@trafficmasters.com",
    status: "active"
  }
];

const TrackingLinkGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Get campaign ID and affiliate ID from URL if they exist
  const urlCampaignId = searchParams.get("campaignId");
  const urlAffiliateId = searchParams.get("affiliateId");
  
  // Form state
  const [campaignId, setCampaignId] = useState<string>(urlCampaignId || "");
  const [affiliateId, setAffiliateId] = useState<string>(urlAffiliateId || "");
  const [sub1, setSub1] = useState<string>("");
  const [sub2, setSub2] = useState<string>("");
  const [sub3, setSub3] = useState<string>("");
  const [deepLink, setDeepLink] = useState<string>("");
  
  // Link generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  
  // Data
  const campaigns = mockCampaigns;
  const affiliates = mockAffiliates;

  const handleGenerateLink = async () => {
    if (!campaignId || !affiliateId) {
      toast({
        title: t("common.error"),
        description: t("trackingLinks.errorSelectBoth"),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Build the link with the parameters
      // In a real app, this would come from the API
      const baseUrl = "https://track.affiliatepro.com/c";
      const params = new URLSearchParams();
      
      params.append("cid", campaignId);
      params.append("aid", affiliateId);
      
      if (sub1) params.append("s1", sub1);
      if (sub2) params.append("s2", sub2);
      if (sub3) params.append("s3", sub3);
      if (deepLink) params.append("dl", encodeURIComponent(deepLink));
      
      const trackingUrl = `${baseUrl}/${campaignId}/${affiliateId}?${params.toString()}`;
      
      setGeneratedLink(trackingUrl);
      toast({
        title: t("trackingLinks.linkGenerated"),
        description: t("trackingLinks.linkGeneratedSuccess"),
      });
    } catch (error) {
      console.error("Error generating link:", error);
      toast({
        title: t("common.error"),
        description: t("trackingLinks.linkGenerationError"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        toast({
          title: t("trackingLinks.copied"),
          description: t("trackingLinks.linkCopied"),
        });
      })
      .catch((error) => {
        console.error("Error copying text:", error);
        toast({
          title: t("common.error"),
          description: t("trackingLinks.copyError"),
          variant: "destructive",
        });
      });
  };

  const getSelectedCampaignName = () => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.name : "";
  };

  const getSelectedAffiliateName = () => {
    const affiliate = affiliates.find(a => a.id === affiliateId);
    return affiliate ? affiliate.name : "";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("trackingLinks.title")}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("trackingLinks.generateLink")}</CardTitle>
            <CardDescription>
              {t("trackingLinks.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("trackingLinks.campaign")}</label>
                <Select
                  value={campaignId}
                  onValueChange={setCampaignId}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("trackingLinks.selectCampaign")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("trackingLinks.campaigns")}</SelectLabel>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("trackingLinks.affiliate")}</label>
                <Select
                  value={affiliateId}
                  onValueChange={setAffiliateId}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("trackingLinks.selectAffiliate")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("trackingLinks.affiliates")}</SelectLabel>
                      {affiliates.map((affiliate) => (
                        <SelectItem key={affiliate.id} value={affiliate.id}>
                          {affiliate.name} - {affiliate.email}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("trackingLinks.subId1")}</label>
                <Input
                  placeholder={t("trackingLinks.subId1Placeholder")}
                  value={sub1}
                  onChange={(e) => setSub1(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("trackingLinks.subId2")}</label>
                <Input
                  placeholder={t("trackingLinks.subId2Placeholder")}
                  value={sub2}
                  onChange={(e) => setSub2(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("trackingLinks.subId3")}</label>
                <Input
                  placeholder={t("trackingLinks.subId3Placeholder")}
                  value={sub3}
                  onChange={(e) => setSub3(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("trackingLinks.deepLink")}</label>
                <Input
                  placeholder={t("trackingLinks.deepLinkPlaceholder")}
                  value={deepLink}
                  onChange={(e) => setDeepLink(e.target.value)}
                  disabled={isGenerating}
                />
                <p className="text-xs text-gray-500">
                  {t("trackingLinks.deepLinkDescription")}
                </p>
              </div>
              
              <Button
                onClick={handleGenerateLink}
                className="w-full bg-affiliate-primary hover:bg-affiliate-primary/90"
                disabled={!campaignId || !affiliateId || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("trackingLinks.generating")}
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    {t("trackingLinks.generateLink")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${!generatedLink && "opacity-60"}`}>
          <CardHeader>
            <CardTitle>{t("trackingLinks.yourTrackingLink")}</CardTitle>
            <CardDescription>
              {generatedLink
                ? t("trackingLinks.linkFor", { campaign: getSelectedCampaignName(), affiliate: getSelectedAffiliateName() })
                : t("trackingLinks.generateLinkToSee")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedLink ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100 break-all">
                  <div className="flex items-center mb-2">
                    <Link className="h-4 w-4 text-affiliate-primary mr-2" />
                    <span className="text-sm font-medium">{t("trackingLinks.trackingUrl")}</span>
                  </div>
                  <p className="text-sm">{generatedLink}</p>
                </div>
                
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {t("trackingLinks.copyToClipboard")}
                </Button>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">{t("trackingLinks.linkDetails")}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">{t("trackingLinks.campaign")}:</div>
                    <div>{getSelectedCampaignName()}</div>
                    
                    <div className="text-gray-500">{t("trackingLinks.affiliate")}:</div>
                    <div>{getSelectedAffiliateName()}</div>
                    
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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="bg-gray-100 p-4 rounded-full">
                  <Link className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium">{t("trackingLinks.noLinkGenerated")}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("trackingLinks.fillFormToGenerate")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackingLinkGenerator;
