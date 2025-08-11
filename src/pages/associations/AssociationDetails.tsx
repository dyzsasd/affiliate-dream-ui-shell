import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { createApiClient } from '@/services/backendApi';
import { DomainAffiliate } from '@/generated-api/src/models';
import { OrganizationAssociationsApi, TrackingLinksApi } from '@/generated-api/src/apis';
import { ModelsTrackingLinkGenerationRequest, ModelsTrackingLinkUpdateRequest } from '@/generated-api/src/models';
import { campaignService } from '@/services/campaign';
import { fetchAffiliates } from '@/services/affiliateService';
import { Campaign } from '@/types/api';
import { ArrowLeft, Users, Mail, Calendar, AlertCircle, Link, Copy, Loader2, Eye, Globe } from 'lucide-react';

const AssociationDetails: React.FC = () => {
  const { affiliateOrgId } = useParams<{ affiliateOrgId: string }>();
  const { organization } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [affiliates, setAffiliates] = useState<DomainAffiliate[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [association, setAssociation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  
  // Modal states
  const [selectedAffiliate, setSelectedAffiliate] = useState<DomainAffiliate | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  
  // Selection and tracking link states
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<number | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [linkName, setLinkName] = useState<string>("");
  const [sourceId, setSourceId] = useState<string>("");
  const [sub1, setSub1] = useState<string>("");
  const [sub2, setSub2] = useState<string>("");
  const [sub3, setSub3] = useState<string>("");
  const [sub4, setSub4] = useState<string>("");
  const [sub5, setSub5] = useState<string>("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [isLoadingExistingLinks, setIsLoadingExistingLinks] = useState(false);
  const [existingTrackingLink, setExistingTrackingLink] = useState<any>(null);

  useEffect(() => {
    if (organization?.organizationId && affiliateOrgId) {
      fetchAssociationData();
    }
  }, [organization, affiliateOrgId]);

  // Effect to fetch existing tracking links when both affiliate and campaign are selected
  useEffect(() => {
    if (selectedAffiliateId && selectedCampaignId) {
      fetchExistingTrackingLinks();
    } else {
      setExistingTrackingLink(null);
      setGeneratedLink("");
    }
  }, [selectedAffiliateId, selectedCampaignId]);

  const fetchAssociationData = async () => {
    try {
      setLoading(true);
      setIsLoadingCampaigns(true);
      
      // First, get the association details to know the advertiser organization ID
      const api = await createApiClient(OrganizationAssociationsApi);
      const associations = await api.organizationAssociationsGet({
        affiliateOrgId: parseInt(affiliateOrgId!),
        associationType: 'request',
        withDetails: true,
      });

      if (associations && associations.length > 0) {
        const currentAssociation = associations[0];
        setAssociation(currentAssociation);
        
        // Fetch campaigns from the advertiser organization
        await fetchCampaigns(currentAssociation.advertiserOrgId);
        
        // Fetch affiliates from the affiliate organization  
        await fetchAffiliatesData();
      } else {
        toast({
          title: t("associations.error"),
          description: t("associations.associationNotFound"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching association data:', error);
      toast({
        title: t("associations.error"),
        description: t("associations.failedToLoadDetails"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsLoadingCampaigns(false);
    }
  };

  const fetchCampaigns = async (advertiserOrgId: number) => {
    try {
      const campaignsData = await campaignService.getCampaigns(advertiserOrgId);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: t("associations.error"),
        description: t("associations.failedToLoadCampaigns"),
        variant: "destructive",
      });
    }
  };

  const fetchAffiliatesData = async () => {
    try {
      const affiliatesData = await fetchAffiliates(parseInt(affiliateOrgId!));
      setAffiliates(affiliatesData);
    } catch (error) {
      console.error('Error fetching affiliates:', error);
      if (error instanceof TypeError && error.message.includes("Cannot read properties of null")) {
        setAffiliates([]);
      } else {
        toast({
          title: t("associations.error"),
          description: t("associations.failedToLoadAffiliates"),
          variant: "destructive",
        });
      }
    }
  };

  const fetchExistingTrackingLinks = async () => {
    if (!selectedAffiliateId || !selectedCampaignId) {
      return;
    }
    
    try {
      setIsLoadingExistingLinks(true);
      const trackingApi = await createApiClient(TrackingLinksApi);
      
      const response = await trackingApi.trackingLinksGet({
        campaignIds: selectedCampaignId,
        affiliateIds: selectedAffiliateId.toString(),
        limit: 10,
        offset: 0
      });

      // If tracking links exist, use the first one to pre-fill the form
      if (response.trackingLinks && response.trackingLinks.length > 0) {
        const firstLink = response.trackingLinks[0];
        console.log('Found existing tracking link structure:', firstLink);
        console.log('Tracking link ID:', firstLink.trackingLinkId);
        setExistingTrackingLink(firstLink);
        if (firstLink.trackingUrl) {
          setGeneratedLink(firstLink.trackingUrl);
          setLinkName(firstLink.name || "");
          setSourceId(firstLink.sourceId || "");
          setSub1(firstLink.sub1 || "");
          setSub2(firstLink.sub2 || "");
          setSub3(firstLink.sub3 || "");
          setSub4(firstLink.sub4 || "");
          setSub5(firstLink.sub5 || "");
        }
      } else {
        setExistingTrackingLink(null);
        setGeneratedLink("");
        setLinkName("");
        setSourceId("");
        setSub1("");
        setSub2("");
        setSub3("");
        setSub4("");
        setSub5("");
      }
    } catch (error) {
      console.error('Error fetching existing tracking links:', error);
      setExistingTrackingLink(null);
      setGeneratedLink("");
    } finally {
      setIsLoadingExistingLinks(false);
    }
  };

  const handleGenerateTrackingLink = async () => {
    if (!selectedCampaignId || !linkName.trim()) {
      toast({
        title: t("associations.error"),
        description: t("associations.selectCampaignAndName"),
        variant: "destructive",
      });
      return;
    }

    if (!selectedAffiliateId) {
      toast({
        title: t("associations.error"), 
        description: t("associations.selectAffiliateFirst"),
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingLink(true);
    
    try {
      const trackingApi = await createApiClient(TrackingLinksApi);
      
      if (existingTrackingLink) {
        // Update existing tracking link
        console.log('Attempting to update existing tracking link:', existingTrackingLink);
        console.log('Existing tracking link ID:', existingTrackingLink.trackingLinkId);
        
        if (!existingTrackingLink.trackingLinkId) {
          console.error('No trackingLinkId found in existing tracking link, creating new one instead');
          // Fall through to create new tracking link
        } else {
          const updateRequest: ModelsTrackingLinkUpdateRequest = {
            name: linkName.trim(),
            description: `Tracking link for affiliate ID ${selectedAffiliateId} - Campaign ${selectedCampaignId}`,
            sourceId: sourceId || undefined,
            sub1: sub1 || undefined,
            sub2: sub2 || undefined,
            sub3: sub3 || undefined,
            sub4: sub4 || undefined,
            sub5: sub5 || undefined,
          };

          const response = await trackingApi.trackingLinksIdPut({
            id: existingTrackingLink.trackingLinkId,
            request: updateRequest
          });

          setGeneratedLink(response.trackingUrl || "");
          setExistingTrackingLink(response);
          toast({
            title: t("associations.success"),
            description: t("associations.trackingLinkUpdated"),
          });
          return;
        }
      }
      
      // Create new tracking link (either no existing link or existing link has no ID)
      const createRequest: ModelsTrackingLinkGenerationRequest = {
        affiliateId: selectedAffiliateId,
        campaignId: parseInt(selectedCampaignId),
        name: linkName.trim(),
        description: `Tracking link for affiliate ID ${selectedAffiliateId} - Campaign ${selectedCampaignId}`,
        sourceId: sourceId || undefined,
        sub1: sub1 || undefined,
        sub2: sub2 || undefined,
        sub3: sub3 || undefined,
        sub4: sub4 || undefined,
        sub5: sub5 || undefined,
      };

      const response = await trackingApi.trackingLinksPost({
        request: createRequest
      });

      setGeneratedLink(response.generatedUrl || "");
      // Refetch to get the created tracking link data
      await fetchExistingTrackingLinks();
      toast({
        title: t("associations.success"),
        description: t("associations.trackingLinkGenerated"),
      });
    } catch (error) {
      console.error('Error generating/updating tracking link:', error);
      toast({
        title: t("associations.error"),
        description: t("associations.trackingLinkError"),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyLinkToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
        .then(() => {
          toast({
            title: t("associations.copied"),
            description: t("associations.trackingLinkCopiedToClipboard"),
          });
        })
        .catch((error) => {
          console.error("Error copying text:", error);
          toast({
            title: t("associations.error"),
            description: t("associations.copyError"),
            variant: "destructive",
          });
        });
    }
  };

  const openAffiliateModal = (affiliate: DomainAffiliate) => {
    setSelectedAffiliate(affiliate);
    setIsAffiliateModalOpen(true);
  };

  const openCampaignModal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsCampaignModalOpen(true);
  };

  const selectAffiliate = (affiliateId: number) => {
    setSelectedAffiliateId(affiliateId);
  };

  const selectCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
  };

  const getSelectedAffiliateObj = () => {
    return affiliates.find(a => a.affiliateId === selectedAffiliateId);
  };

  const getSelectedCampaignObj = () => {
    return campaigns.find(c => c.id === selectedCampaignId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("associations.loadingDetails")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/associations')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t("associations.backToAssociations")}</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl">{t("associations.associationDetails")}</CardTitle>
                </div>
              </div>
            </div>
            <CardDescription>
              {t("associations.manageAssociationFor")}: {association?.affiliateOrganization?.name || affiliateOrgId}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Two-column layout for Campaigns and Affiliates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visible Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t("associations.visibleCampaigns")}
              </CardTitle>
              <CardDescription>
                {isLoadingCampaigns ? t("associations.loadingCampaigns") : t("associations.selectCampaignForLink")}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoadingCampaigns ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>{t("associations.loadingCampaigns")}</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("associations.noCampaigns")}</h3>
                  <p className="text-muted-foreground">{t("associations.noCampaignsMessage")}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {campaigns.map((campaign) => (
                    <div 
                      key={campaign.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedCampaignId === campaign.id ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                      onClick={() => selectCampaign(campaign.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{campaign.description}</p>
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                            {campaign.status}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCampaignModal(campaign);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visible Affiliates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t("associations.visibleAffiliates")}
              </CardTitle>
              <CardDescription>
                {t("associations.selectAffiliateForLink")}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {affiliates.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("associations.noVisibleAffiliates")}</h3>
                  <p className="text-muted-foreground">{t("associations.noVisibleAffiliatesMessage")}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {affiliates.map((affiliate) => (
                    <div 
                      key={affiliate.affiliateId}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedAffiliateId === affiliate.affiliateId ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                      onClick={() => selectAffiliate(affiliate.affiliateId!)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {affiliate.name?.charAt(0) || affiliate.contactEmail?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {affiliate.name || t("associations.unknownName")}
                            </h4>
                            <p className="text-sm text-muted-foreground">{affiliate.contactEmail}</p>
                            <Badge 
                              variant={affiliate.status === 'active' ? 'default' : 'secondary'}
                              className="mt-1"
                            >
                              {affiliate.status || t("associations.unknown")}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAffiliateModal(affiliate);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tracking Link Generation */}
        {affiliates.length > 0 && campaigns.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Link className="w-6 h-6 text-primary" />
                <CardTitle>{t("associations.generateTrackingLink")}</CardTitle>
              </div>
              <CardDescription>
                {selectedAffiliateId && selectedCampaignId 
                  ? `${t("associations.createTrackingLinkFor")}: ${getSelectedAffiliateObj()?.name || t("associations.selectedAffiliate")} & ${getSelectedCampaignObj()?.name || t("associations.selectedCampaign")}`
                  : t("associations.selectBothToGenerate")
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {(!selectedAffiliateId || !selectedCampaignId) && (
                <div className="p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
                  <p className="text-center text-muted-foreground">
                    {t("associations.selectBothMessage")}
                  </p>
                </div>
              )}
              
              {selectedAffiliateId && selectedCampaignId && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="link-name">{t("associations.linkName")}</Label>
                      <Input
                        id="link-name"
                        placeholder={t("associations.enterLinkName")}
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="source-id">{t("associations.sourceId")}</Label>
                      <Input
                        id="source-id"
                        placeholder="e.g. facebook"
                        value={sourceId}
                        onChange={(e) => setSourceId(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                    <div className="space-y-2">
                      <Label htmlFor="sub1">Sub ID 1</Label>
                      <Input
                        id="sub1"
                        placeholder="e.g. campaign_123"
                        value={sub1}
                        onChange={(e) => setSub1(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sub2">Sub ID 2</Label>
                      <Input
                        id="sub2"
                        placeholder="e.g. adset_456"
                        value={sub2}
                        onChange={(e) => setSub2(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sub3">Sub ID 3</Label>
                      <Input
                        id="sub3"
                        placeholder="e.g. ad_789"
                        value={sub3}
                        onChange={(e) => setSub3(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sub4">Sub ID 4</Label>
                      <Input
                        id="sub4"
                        placeholder="e.g. placement_mobile"
                        value={sub4}
                        onChange={(e) => setSub4(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sub5">Sub ID 5</Label>
                      <Input
                        id="sub5"
                        placeholder="e.g. audience_lookalike"
                        value={sub5}
                        onChange={(e) => setSub5(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateTrackingLink}
                    disabled={isGeneratingLink || !linkName.trim()}
                    className="w-full md:w-auto"
                  >
                    {isGeneratingLink ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("associations.generating")}
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4 mr-2" />
                        {t("associations.generateTrackingLink")}
                      </>
                    )}
                  </Button>
                  
                  {generatedLink && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <Label className="text-sm font-medium mb-2 block">{t("associations.generatedTrackingLink")}</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          value={generatedLink} 
                          readOnly 
                          className="flex-1 font-mono text-sm"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={copyLinkToClipboard}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Affiliate Detail Modal */}
        <Dialog open={isAffiliateModalOpen} onOpenChange={setIsAffiliateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t("associations.affiliateDetails")}
              </DialogTitle>
              <DialogDescription>
                {t("associations.detailedAffiliateInformation")}
              </DialogDescription>
            </DialogHeader>
            
            {selectedAffiliate && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">{t("associations.name")}</Label>
                    <p className="text-sm">{selectedAffiliate.name || t("associations.unknownName")}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">{t("associations.email")}</Label>
                    <p className="text-sm">{selectedAffiliate.contactEmail || t("associations.noEmail")}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">{t("associations.status")}</Label>
                    <Badge variant={selectedAffiliate.status === 'active' ? 'default' : 'secondary'}>
                      {selectedAffiliate.status || t("associations.unknown")}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">{t("associations.affiliateId")}</Label>
                    <p className="text-sm font-mono">{selectedAffiliate.affiliateId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">{t("associations.createdAt")}</Label>
                    <p className="text-sm">
                      {selectedAffiliate.createdAt 
                        ? new Date(selectedAffiliate.createdAt).toLocaleDateString() 
                        : t("associations.na")
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">{t("associations.updatedAt")}</Label>
                    <p className="text-sm">
                      {selectedAffiliate.updatedAt 
                        ? new Date(selectedAffiliate.updatedAt).toLocaleDateString() 
                        : t("associations.na")
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Campaign Detail Modal */}
        <Dialog open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t("associations.campaignDetails")}
              </DialogTitle>
              <DialogDescription>
                {t("associations.detailedCampaignInformation")}
              </DialogDescription>
            </DialogHeader>
            
            {selectedCampaign && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">{t("associations.name")}</Label>
                    <p className="text-sm">{selectedCampaign.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">{t("associations.status")}</Label>
                    <Badge variant={selectedCampaign.status === 'active' ? 'default' : 'secondary'}>
                      {selectedCampaign.status}
                    </Badge>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium">{t("associations.description")}</Label>
                    <p className="text-sm">{selectedCampaign.description || t("associations.noDescription")}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">{t("associations.campaignId")}</Label>
                    <p className="text-sm font-mono">{selectedCampaign.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">{t("associations.createdAt")}</Label>
                    <p className="text-sm">
                      {new Date(selectedCampaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedCampaign.startDate && (
                    <div>
                      <Label className="text-sm font-medium">{t("associations.startDate")}</Label>
                      <p className="text-sm">
                        {new Date(selectedCampaign.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedCampaign.endDate && (
                    <div>
                      <Label className="text-sm font-medium">{t("associations.endDate")}</Label>
                      <p className="text-sm">
                        {new Date(selectedCampaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AssociationDetails;