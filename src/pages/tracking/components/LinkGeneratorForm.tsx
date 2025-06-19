
import React from "react";
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
import { LinkIcon, Loader2 } from "lucide-react";
import { Campaign } from "@/types/api";

interface LinkGeneratorFormProps {
  campaignId: string;
  setCampaignId: (value: string) => void;
  affiliateId: string;
  setAffiliateId: (value: string) => void;
  sub1: string;
  setSub1: (value: string) => void;
  sub2: string;
  setSub2: (value: string) => void;
  sub3: string;
  setSub3: (value: string) => void;
  deepLink: string;
  setDeepLink: (value: string) => void;
  isGenerating: boolean;
  onGenerateLink: () => void;
  campaigns: Campaign[];
  affiliates: Array<{ id: string; name: string; email: string }>;
  isLoadingCampaigns?: boolean;
}

const LinkGeneratorForm: React.FC<LinkGeneratorFormProps> = ({
  campaignId,
  setCampaignId,
  affiliateId,
  setAffiliateId,
  sub1,
  setSub1,
  sub2,
  setSub2,
  sub3,
  setSub3,
  deepLink,
  setDeepLink,
  isGenerating,
  onGenerateLink,
  campaigns,
  affiliates,
  isLoadingCampaigns = false,
}) => {
  const { t } = useTranslation();

  return (
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
              disabled={isGenerating || isLoadingCampaigns}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoadingCampaigns 
                    ? t("trackingLinks.loadingCampaigns") 
                    : t("trackingLinks.selectCampaign")
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("trackingLinks.campaigns")}</SelectLabel>
                  {isLoadingCampaigns ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("trackingLinks.loadingCampaigns")}
                      </div>
                    </SelectItem>
                  ) : campaigns.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      {t("trackingLinks.noCampaigns")}
                    </SelectItem>
                  ) : (
                    campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))
                  )}
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
            onClick={onGenerateLink}
            className="w-full bg-affiliate-primary hover:bg-affiliate-primary/90"
            disabled={!campaignId || !affiliateId || isGenerating || isLoadingCampaigns}
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
  );
};

export default LinkGeneratorForm;
