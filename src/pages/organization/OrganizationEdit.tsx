import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { OrganizationsApi } from '@/generated-api/src/apis';
import { 
  HandlersUpdateOrganizationRequest, 
  HandlersAdvertiserExtraInfoRequest, 
  HandlersAffiliateExtraInfoRequest,
  HandlersAdvertiserExtraInfoRequestCompanySizeEnum,
  HandlersAdvertiserExtraInfoRequestWebsiteTypeEnum,
  HandlersAffiliateExtraInfoRequestAffiliateTypeEnum
} from '@/generated-api/src/models';
import { createApiClient } from '@/services/backendApi';
import { ArrowLeft, Building2, Target, Users } from 'lucide-react';

const baseSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  contactEmail: z.string().email('Please enter a valid email'),
});

const affiliateSchema = baseSchema.extend({
  affiliateType: z.string().min(1, 'Please select an affiliate type'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  selfDescription: z.string().min(10, 'Please provide at least 10 characters description'),
  logoUrl: z.string().url('Please enter a valid logo URL').optional().or(z.literal(''))
});

const advertiserSchema = baseSchema.extend({
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  websiteType: z.enum(['shopify', 'amazon', 'shopline', 'tiktok_shop', 'other'], {
    required_error: 'Please select a website type',
  }),
  companySize: z.enum(['startup', 'small', 'medium', 'large', 'enterprise'], {
    required_error: 'Please select a company size',
  }),
});

const agencySchema = baseSchema.extend({
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type OrganizationEditData = z.infer<typeof baseSchema> & {
  // Affiliate fields
  affiliateType?: string;
  selfDescription?: string;
  logoUrl?: string;
  // Advertiser fields
  websiteType?: string;
  companySize?: string;
  // Common fields
  website?: string;
};

export const OrganizationEdit: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { organization, fetchOrganization } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getSchemaForType = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'affiliate':
        return affiliateSchema;
      case 'advertiser':
        return advertiserSchema;
      case 'agency':
        return agencySchema;
      default:
        return baseSchema;
    }
  };

  const schema = organization ? getSchemaForType(organization.type) : baseSchema;

  const form = useForm<OrganizationEditData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      contactEmail: '',
      website: '',
      affiliateType: '',
      selfDescription: '',
      logoUrl: '',
      websiteType: 'shopify',
      companySize: 'startup',
    },
  });

  useEffect(() => {
    const loadOrganizationData = async () => {
      if (!organization?.organizationId) {
        toast({
          title: "Error",
          description: "No organization found to edit",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsLoading(true);
      try {
        // Since the GET endpoint only returns basic info, we'll work with what we have
        // and initialize the form with available data from the auth context
        form.setValue('name', organization.name || '');
        form.setValue('description', ''); // Not available in current API
        form.setValue('contactEmail', ''); // Not available in current API

        // Initialize type-specific fields with defaults since we can't fetch them
        // Users will need to re-enter these values
        if (organization.type?.toLowerCase() === 'affiliate') {
          form.setValue('affiliateType', '');
          form.setValue('website', '');
          form.setValue('selfDescription', '');
          form.setValue('logoUrl', '');
        } else if (organization.type?.toLowerCase() === 'advertiser') {
          form.setValue('website', '');
          form.setValue('websiteType', 'shopify');
          form.setValue('companySize', 'startup');
        } else if (organization.type?.toLowerCase() === 'agency') {
          form.setValue('website', '');
        }

      } catch (error) {
        console.error('Error loading organization:', error);
        toast({
          title: "Error",
          description: "Failed to load organization data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizationData();
  }, [organization, form, toast, navigate]);

  const onSubmit = async (data: OrganizationEditData) => {
    if (!organization?.organizationId) return;

    setIsSubmitting(true);
    
    try {
      const organizationsApi = await createApiClient(OrganizationsApi);
      
      let updateRequest: HandlersUpdateOrganizationRequest = {
        name: data.name,
        description: data.description,
        contactEmail: data.contactEmail,
        type: organization.type?.toLowerCase() as any,
      };

      // Add type-specific extra info
      if (organization.type?.toLowerCase() === 'affiliate') {
        const affiliateExtraInfo: HandlersAffiliateExtraInfoRequest = {
          affiliateType: data.affiliateType as HandlersAffiliateExtraInfoRequestAffiliateTypeEnum,
          website: data.website || undefined,
          selfDescription: data.selfDescription,
          logoUrl: data.logoUrl || undefined
        };
        updateRequest.affiliateExtraInfo = affiliateExtraInfo;
      } else if (organization.type?.toLowerCase() === 'advertiser') {
        const advertiserExtraInfo: HandlersAdvertiserExtraInfoRequest = {
          website: data.website || undefined,
          websiteType: data.websiteType as HandlersAdvertiserExtraInfoRequestWebsiteTypeEnum,
          companySize: data.companySize as HandlersAdvertiserExtraInfoRequestCompanySizeEnum,
        };
        updateRequest.advertiserExtraInfo = advertiserExtraInfo;
      }
      // Agency doesn't have extra info in the current schema

      await organizationsApi.organizationsIdPut({
        id: organization.organizationId,
        request: updateRequest
      });

      // Refresh organization data
      if (organization.organizationId) {
        await fetchOrganization(organization.organizationId);
      }

      toast({
        title: "Organization updated",
        description: "Your organization has been updated successfully.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: "Error",
        description: "Failed to update organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = () => {
    switch (organization?.type?.toLowerCase()) {
      case 'affiliate':
        return <Users className="w-8 h-8 text-primary" />;
      case 'advertiser':
        return <Target className="w-8 h-8 text-primary" />;
      case 'agency':
        return <Building2 className="w-8 h-8 text-primary" />;
      default:
        return <Building2 className="w-8 h-8 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (organization?.type?.toLowerCase()) {
      case 'affiliate':
        return 'Edit Affiliate Organization';
      case 'advertiser':
        return 'Edit Advertiser Organization';
      case 'agency':
        return 'Edit Agency Organization';
      default:
        return 'Edit Organization';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading organization data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            {getIcon()}
          </div>
          <CardTitle className="text-2xl">{getTitle()}</CardTitle>
          <CardDescription>
            Update your organization details and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter your organization name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Describe your organization"
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                {...form.register('contactEmail')}
                placeholder="contact@yourcompany.com"
              />
              {form.formState.errors.contactEmail && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.contactEmail.message}
                </p>
              )}
            </div>

            {/* Affiliate-specific fields */}
            {organization?.type?.toLowerCase() === 'affiliate' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="affiliateType">Affiliate Type</Label>
                  <Select
                    value={form.watch('affiliateType')}
                    onValueChange={(value) => form.setValue('affiliateType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your affiliate type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cashback">Cashback</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="incentive">Incentive</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="forum">Forum</SelectItem>
                      <SelectItem value="sub_affiliate_network">Sub Affiliate Network</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.affiliateType && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.affiliateType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://your-website.com"
                    {...form.register('website')}
                  />
                  {form.formState.errors.website && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.website.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selfDescription">Description</Label>
                  <Textarea
                    id="selfDescription"
                    placeholder="Tell us about your affiliate business and audience..."
                    {...form.register('selfDescription')}
                    rows={4}
                  />
                  {form.formState.errors.selfDescription && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.selfDescription.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                  <Input
                    id="logoUrl"
                    type="url"
                    placeholder="https://your-logo.com/logo.png"
                    {...form.register('logoUrl')}
                  />
                  {form.formState.errors.logoUrl && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.logoUrl.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Advertiser-specific fields */}
            {organization?.type?.toLowerCase() === 'advertiser' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    {...form.register('website')}
                    placeholder="https://yourwebsite.com"
                  />
                  {form.formState.errors.website && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.website.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteType">Website Type</Label>
                  <Select
                    value={form.watch('websiteType')}
                    onValueChange={(value) => form.setValue('websiteType', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your website type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="shopline">Shopline</SelectItem>
                      <SelectItem value="tiktok_shop">TikTok Shop</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.websiteType && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.websiteType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select
                    value={form.watch('companySize')}
                    onValueChange={(value) => form.setValue('companySize', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                      <SelectItem value="small">Small (11-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                      <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.companySize && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.companySize.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Agency-specific fields */}
            {organization?.type?.toLowerCase() === 'agency' && (
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  {...form.register('website')}
                  placeholder="https://youragency.com"
                />
                {form.formState.errors.website && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.website.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Updating..." : "Update Organization"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationEdit;