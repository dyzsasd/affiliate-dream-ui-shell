import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createApiClient } from '@/services/backendApi';
import { DomainAffiliate } from '@/generated-api/src/models';
import { OrganizationAssociationsApi, TrackingLinksApi } from '@/generated-api/src/apis';
import { ModelsTrackingLinkUpsertRequest } from '@/generated-api/src/models/ModelsTrackingLinkUpsertRequest';
import { campaignService } from '@/services/campaign';
import { Campaign } from '@/types/api';
import { ArrowLeft, Users, Mail, Calendar, AlertCircle, Link, Copy, Loader2 } from 'lucide-react';

const AffiliateDetails: React.FC = () => {
  const { affiliateOrgId } = useParams<{ affiliateOrgId: string }>();
  const { organization } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [affiliates, setAffiliates] = useState<DomainAffiliate[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  
  // Tracking link generation state
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<number | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [linkName, setLinkName] = useState<string>("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>("");

  useEffect(() => {
    if (organization?.organizationId && affiliateOrgId) {
      fetchVisibleAffiliates();
      fetchCampaigns();
    }
  }, [organization, affiliateOrgId]);

  const fetchVisibleAffiliates = async () => {
    try {
      setLoading(true);
      const api = await createApiClient(OrganizationAssociationsApi);
      
      const response = await api.organizationsAdvertiserOrgIdVisibleAffiliatesGet({
        advertiserOrgId: organization!.organizationId!,
        affiliateOrgId: parseInt(affiliateOrgId!),
      });

      // Handle null response from API
      setAffiliates(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching visible affiliates:', error);
      // When API returns null, the transformer fails - handle this gracefully
      if (error instanceof TypeError && error.message.includes("Cannot read properties of null")) {
        console.log('API returned null, setting empty array');
        setAffiliates([]);
      } else {
        toast({
          title: t("associations.error"),
          description: t("associations.failedToLoadDetails"),
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setIsLoadingCampaigns(true);
      const campaignsData = await campaignService.getCampaigns(organization!.organizationId!);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: t("associations.error"),
        description: t("associations.failedToLoadCampaigns"),
        variant: "destructive",
      });
    } finally {
      setIsLoadingCampaigns(false);
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
      
      const request: ModelsTrackingLinkUpsertRequest = {
        affiliateId: selectedAffiliateId,
        campaignId: parseInt(selectedCampaignId),
        name: linkName.trim(),
        description: `Tracking link for affiliate ID ${selectedAffiliateId} - Campaign ${selectedCampaignId}`,
      };

      const response = await trackingApi.organizationsOrganizationIdTrackingLinksUpsertPost({
        organizationId: organization!.organizationId!,
        request: request
      });

      setGeneratedLink(response.generatedUrl || "");
      toast({
        title: t("associations.success"),
        description: t("associations.trackingLinkGenerated"),
      });
    } catch (error) {
      console.error('Error generating tracking link:', error);
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

  const getSelectedAffiliate = () => {
    return affiliates.find(a => a.affiliateId === selectedAffiliateId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("associations.loadingAffiliateDetails")}</p>
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
                  <CardTitle className="text-2xl">{t("associations.affiliateOrganizationDetails")}</CardTitle>
                </div>
              </div>
            </div>
            <CardDescription>
              {t("associations.visibleAffiliatesFor")}: {affiliateOrgId}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Affiliates Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t("associations.visibleAffiliates")}</CardTitle>
            <CardDescription>
              {t("associations.listOfAffiliates")}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {affiliates.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("associations.noVisibleAffiliates")}</h3>
                <p className="text-muted-foreground">
                  {t("associations.noVisibleAffiliatesMessage")}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("associations.select")}</TableHead>
                    <TableHead>{t("associations.name")}</TableHead>
                    <TableHead>{t("associations.email")}</TableHead>
                    <TableHead>{t("associations.status")}</TableHead>
                    <TableHead>{t("associations.createdDate")}</TableHead>
                    <TableHead>{t("associations.updatedDate")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map((affiliate) => (
                    <TableRow 
                      key={affiliate.affiliateId}
                      className={selectedAffiliateId === affiliate.affiliateId ? "bg-muted/50" : ""}
                    >
                      <TableCell>
                        <Button
                          variant={selectedAffiliateId === affiliate.affiliateId ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedAffiliateId(affiliate.affiliateId!)}
                        >
                          {selectedAffiliateId === affiliate.affiliateId ? t("associations.selected") : t("associations.select")}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {affiliate.name?.charAt(0) || affiliate.contactEmail?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {affiliate.name || t("associations.unknownName")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{affiliate.contactEmail || t("associations.noEmail")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={affiliate.status === 'active' ? 'default' : 'secondary'}
                          className={
                            affiliate.status === 'active' 
                              ? 'text-green-600 border-green-600' 
                              : ''
                          }
                        >
                          {affiliate.status || t("associations.unknown")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {affiliate.createdAt 
                              ? new Date(affiliate.createdAt).toLocaleDateString() 
                              : t("associations.na")
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {affiliate.updatedAt 
                              ? new Date(affiliate.updatedAt).toLocaleDateString() 
                              : t("associations.na")
                            }
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Tracking Link Section */}
        {affiliates.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Link className="w-6 h-6 text-primary" />
                <CardTitle>{t("associations.generateTrackingLink")}</CardTitle>
              </div>
              <CardDescription>
                {selectedAffiliateId 
                  ? `${t("associations.createTrackingLinkFor")}: ${getSelectedAffiliate()?.name || t("associations.selectedAffiliate")}`
                  : t("associations.selectAffiliateDescription")
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {!selectedAffiliateId && (
                <div className="p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
                  <p className="text-center text-muted-foreground">
                    {t("associations.selectAffiliateMessage")}
                  </p>
                </div>
              )}
              
              {selectedAffiliateId && (
                <>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-medium">{t("associations.selectedAffiliate")}:</span>
                      <span>{getSelectedAffiliate()?.name || t("associations.unknownName")}</span>
                      <Badge variant="outline">
                        ID: {selectedAffiliateId}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-select">{t("associations.selectCampaign")}</Label>
                      <Select 
                        value={selectedCampaignId} 
                        onValueChange={setSelectedCampaignId}
                        disabled={isLoadingCampaigns}
                      >
                        <SelectTrigger id="campaign-select">
                          <SelectValue placeholder={
                            isLoadingCampaigns ? t("associations.loadingCampaigns") : t("associations.chooseCampaign")
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {campaigns.map((campaign) => (
                            <SelectItem key={campaign.id} value={campaign.id}>
                              {campaign.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="link-name">{t("associations.linkName")}</Label>
                      <Input
                        id="link-name"
                        placeholder={t("associations.enterLinkName")}
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateTrackingLink}
                    disabled={isGeneratingLink || !selectedCampaignId || !linkName.trim()}
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
      </div>
    </div>
  );
};

export default AffiliateDetails;