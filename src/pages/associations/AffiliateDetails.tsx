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
import { ModelsTrackingLinkGenerationRequest } from '@/generated-api/src/models/ModelsTrackingLinkGenerationRequest';
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

      setAffiliates(response || []);
    } catch (error) {
      console.error('Error fetching visible affiliates:', error);
      toast({
        title: "Error",
        description: "Failed to load affiliate details",
        variant: "destructive",
      });
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
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const handleGenerateTrackingLink = async () => {
    if (!selectedCampaignId || !linkName.trim()) {
      toast({
        title: "Error",
        description: "Please select a campaign and enter a link name",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAffiliateId) {
      toast({
        title: "Error", 
        description: "Please select an affiliate to create tracking link for",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingLink(true);
    
    try {
      const trackingApi = await createApiClient(TrackingLinksApi);
      
      const request: ModelsTrackingLinkGenerationRequest = {
        affiliateId: selectedAffiliateId,
        campaignId: parseInt(selectedCampaignId),
        name: linkName.trim(),
        description: `Tracking link for affiliate ID ${selectedAffiliateId} - Campaign ${selectedCampaignId}`,
      };

      const response = await trackingApi.organizationsOrganizationIdTrackingLinksGeneratePost({
        organizationId: organization!.organizationId!,
        request: request
      });

      setGeneratedLink(response.generatedUrl || "");
      toast({
        title: "Success",
        description: "Tracking link generated successfully!",
      });
    } catch (error) {
      console.error('Error generating tracking link:', error);
      toast({
        title: "Error",
        description: "Failed to generate tracking link",
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
            title: "Copied",
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
          <p>Loading affiliate details...</p>
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
                  <span>Back to Associations</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl">Affiliate Organization Details</CardTitle>
                </div>
              </div>
            </div>
            <CardDescription>
              Visible affiliates for organization ID: {affiliateOrgId}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Affiliates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visible Affiliates</CardTitle>
            <CardDescription>
              List of affiliates that are visible to your organization
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {affiliates.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Visible Affiliates</h3>
                <p className="text-muted-foreground">
                  There are no visible affiliates for this organization.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Updated Date</TableHead>
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
                          {selectedAffiliateId === affiliate.affiliateId ? "Selected" : "Select"}
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
                              {affiliate.name || 'Unknown Name'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{affiliate.contactEmail || 'No email'}</span>
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
                          {affiliate.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {affiliate.createdAt 
                              ? new Date(affiliate.createdAt).toLocaleDateString() 
                              : 'N/A'
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
                              : 'N/A'
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
                <CardTitle>Generate Tracking Link</CardTitle>
              </div>
              <CardDescription>
                {selectedAffiliateId 
                  ? `Create a tracking link for: ${getSelectedAffiliate()?.name || 'Selected Affiliate'}`
                  : "Select an affiliate from the table above, then choose a campaign to create a tracking link"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {!selectedAffiliateId && (
                <div className="p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
                  <p className="text-center text-muted-foreground">
                    Please select an affiliate from the table above to continue
                  </p>
                </div>
              )}
              
              {selectedAffiliateId && (
                <>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-medium">Selected Affiliate:</span>
                      <span>{getSelectedAffiliate()?.name || 'Unknown'}</span>
                      <Badge variant="outline">
                        ID: {selectedAffiliateId}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-select">Select Campaign</Label>
                      <Select 
                        value={selectedCampaignId} 
                        onValueChange={setSelectedCampaignId}
                        disabled={isLoadingCampaigns}
                      >
                        <SelectTrigger id="campaign-select">
                          <SelectValue placeholder={
                            isLoadingCampaigns ? "Loading campaigns..." : "Choose a campaign"
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
                      <Label htmlFor="link-name">Link Name</Label>
                      <Input
                        id="link-name"
                        placeholder="Enter a name for this tracking link"
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
                        Generating...
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4 mr-2" />
                        Generate Tracking Link
                      </>
                    )}
                  </Button>
                  
                  {generatedLink && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <Label className="text-sm font-medium mb-2 block">Generated Tracking Link</Label>
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