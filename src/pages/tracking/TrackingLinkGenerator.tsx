
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { campaignService } from "@/services/campaign";
import { Campaign } from "@/types/api";
import LinkGeneratorForm from "./components/LinkGeneratorForm";
import LinkDisplay from "./components/LinkDisplay";

// Empty affiliates data since mock removed
const mockAffiliates: any[] = [];

const TrackingLinkGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { organization } = useAuth();
  
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
  
  // Data state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState<boolean>(true);
  const affiliates = mockAffiliates;

  // Fetch campaigns from backend API
  useEffect(() => {
    if (!organization?.organizationId) {
      setIsLoadingCampaigns(false);
      return;
    }

    const fetchCampaigns = async () => {
      setIsLoadingCampaigns(true);
      try {
        console.log('Fetching campaigns for tracking link generator...');
        const data = await campaignService.getCampaigns(organization.organizationId);
        console.log('Campaigns fetched for tracking:', data);
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns for tracking:", error);
        toast({
          title: t("common.error"),
          description: t("trackingLinks.errorLoadingCampaigns"),
          variant: "destructive",
        });
      } finally {
        setIsLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, [organization?.organizationId, toast, t]);

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
        <LinkGeneratorForm
          campaignId={campaignId}
          setCampaignId={setCampaignId}
          affiliateId={affiliateId}
          setAffiliateId={setAffiliateId}
          sub1={sub1}
          setSub1={setSub1}
          sub2={sub2}
          setSub2={setSub2}
          sub3={sub3}
          setSub3={setSub3}
          deepLink={deepLink}
          setDeepLink={setDeepLink}
          isGenerating={isGenerating}
          onGenerateLink={handleGenerateLink}
          campaigns={campaigns}
          affiliates={affiliates}
          isLoadingCampaigns={isLoadingCampaigns}
        />
        
        <LinkDisplay
          generatedLink={generatedLink}
          campaignName={getSelectedCampaignName()}
          affiliateName={getSelectedAffiliateName()}
          sub1={sub1}
          sub2={sub2}
          sub3={sub3}
          deepLink={deepLink}
          onCopyToClipboard={copyToClipboard}
        />
      </div>
    </div>
  );
};

export default TrackingLinkGenerator;
