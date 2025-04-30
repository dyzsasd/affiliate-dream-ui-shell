
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { mockCampaigns, mockCampaignDetail } from "@/services/api";
import { Copy, Link, LinkIcon, Loader2 } from "lucide-react";

const TrackingLinkGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Get campaign ID and offer ID from URL if they exist
  const urlCampaignId = searchParams.get("campaignId");
  const urlOfferId = searchParams.get("offerId");
  
  // Form state
  const [campaignId, setCampaignId] = useState<string>(urlCampaignId || "");
  const [offerId, setOfferId] = useState<string>(urlOfferId || "");
  const [sub1, setSub1] = useState<string>("");
  const [sub2, setSub2] = useState<string>("");
  const [sub3, setSub3] = useState<string>("");
  const [deepLink, setDeepLink] = useState<string>("");
  
  // Link generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  
  // Campaigns data
  const campaigns = mockCampaigns;
  const [selectedCampaignOffers, setSelectedCampaignOffers] = useState(mockCampaignDetail.offers);
  
  useEffect(() => {
    if (campaignId) {
      // In a real app, we would fetch campaign details to get the offers
      // For now, we'll just use our mock data
      setSelectedCampaignOffers(mockCampaignDetail.offers);
    } else {
      setSelectedCampaignOffers([]);
      setOfferId("");
    }
  }, [campaignId]);

  const handleGenerateLink = async () => {
    if (!campaignId || !offerId) {
      toast({
        title: "Error",
        description: "Please select both a campaign and an offer",
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
      params.append("oid", offerId);
      
      if (sub1) params.append("s1", sub1);
      if (sub2) params.append("s2", sub2);
      if (sub3) params.append("s3", sub3);
      if (deepLink) params.append("dl", encodeURIComponent(deepLink));
      
      const trackingUrl = `${baseUrl}/${campaignId}/${offerId}?${params.toString()}`;
      
      setGeneratedLink(trackingUrl);
      toast({
        title: "Link Generated",
        description: "Your tracking link has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating link:", error);
      toast({
        title: "Error",
        description: "Failed to generate tracking link",
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
          title: "Copied!",
          description: "Tracking link copied to clipboard",
        });
      })
      .catch((error) => {
        console.error("Error copying text:", error);
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive",
        });
      });
  };

  const getSelectedCampaignName = () => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign ? campaign.name : "";
  };

  const getSelectedOfferName = () => {
    const offer = selectedCampaignOffers.find(o => o.id === offerId);
    return offer ? offer.name : "";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Tracking Link Generator</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate Link</CardTitle>
            <CardDescription>
              Create a tracking link for your promotional campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign</label>
                <Select
                  value={campaignId}
                  onValueChange={setCampaignId}
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Campaigns</SelectLabel>
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
                <label className="text-sm font-medium">Offer</label>
                <Select
                  value={offerId}
                  onValueChange={setOfferId}
                  disabled={!campaignId || isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an offer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Offers</SelectLabel>
                      {selectedCampaignOffers.map((offer) => (
                        <SelectItem key={offer.id} value={offer.id}>
                          {offer.name} - ${offer.payoutAmount.toFixed(2)} {offer.payoutType}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub ID 1 (Optional)</label>
                <Input
                  placeholder="e.g., source, channel"
                  value={sub1}
                  onChange={(e) => setSub1(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub ID 2 (Optional)</label>
                <Input
                  placeholder="e.g., campaign, banner size"
                  value={sub2}
                  onChange={(e) => setSub2(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sub ID 3 (Optional)</label>
                <Input
                  placeholder="e.g., placement, ad version"
                  value={sub3}
                  onChange={(e) => setSub3(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Deep Link URL (Optional)</label>
                <Input
                  placeholder="https://example.com/specific-page"
                  value={deepLink}
                  onChange={(e) => setDeepLink(e.target.value)}
                  disabled={isGenerating}
                />
                <p className="text-xs text-gray-500">
                  Used to direct users to a specific page after conversion.
                </p>
              </div>
              
              <Button
                onClick={handleGenerateLink}
                className="w-full bg-affiliate-primary hover:bg-affiliate-primary/90"
                disabled={!campaignId || !offerId || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Generate Link
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${!generatedLink && "opacity-60"}`}>
          <CardHeader>
            <CardTitle>Your Tracking Link</CardTitle>
            <CardDescription>
              {generatedLink
                ? `Link for ${getSelectedCampaignName()} - ${getSelectedOfferName()}`
                : "Generate a link to see it here"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedLink ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100 break-all">
                  <div className="flex items-center mb-2">
                    <Link className="h-4 w-4 text-affiliate-primary mr-2" />
                    <span className="text-sm font-medium">Tracking URL</span>
                  </div>
                  <p className="text-sm">{generatedLink}</p>
                </div>
                
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Link Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Campaign:</div>
                    <div>{getSelectedCampaignName()}</div>
                    
                    <div className="text-gray-500">Offer:</div>
                    <div>{getSelectedOfferName()}</div>
                    
                    {sub1 && (
                      <>
                        <div className="text-gray-500">Sub ID 1:</div>
                        <div>{sub1}</div>
                      </>
                    )}
                    
                    {sub2 && (
                      <>
                        <div className="text-gray-500">Sub ID 2:</div>
                        <div>{sub2}</div>
                      </>
                    )}
                    
                    {sub3 && (
                      <>
                        <div className="text-gray-500">Sub ID 3:</div>
                        <div>{sub3}</div>
                      </>
                    )}
                    
                    {deepLink && (
                      <>
                        <div className="text-gray-500">Deep Link:</div>
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
                  <h3 className="font-medium">No Link Generated Yet</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill out the form and generate a tracking link to see it here.
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
