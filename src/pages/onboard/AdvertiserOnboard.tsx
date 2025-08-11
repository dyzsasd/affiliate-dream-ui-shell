import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { OrganizationsApi } from '@/generated-api/src/apis';
import { ProfileApi } from '@/generated-api/src/apis/ProfileApi';
import { HandlersCreateOrganizationRequest, HandlersAdvertiserExtraInfoRequest } from '@/generated-api/src/models';
import { createPublicApiClient, createApiClient } from '@/services/backendApi';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const advertiserSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  websiteType: z.enum(['shopify', 'amazon', 'shopline', 'tiktok_shop', 'other'], {
    required_error: 'Please select a website type',
  }),
  industry: z.string().min(1, 'Industry is required'),
  companySize: z.enum(['startup', 'small', 'medium', 'large', 'enterprise'], {
    required_error: 'Please select a company size',
  }),
  contactEmail: z.string().email('Please enter a valid email'),
});

type AdvertiserFormData = z.infer<typeof advertiserSchema>;

export const AdvertiserOnboard: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, fetchBackendProfile } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<AdvertiserFormData>({
    resolver: zodResolver(advertiserSchema),
    defaultValues: {
      organizationName: '',
      description: '',
      website: '',
      websiteType: 'shopify' as const,
      industry: '',
      companySize: 'startup' as const,
      contactEmail: user?.email || '',
    },
  });

  const onSubmit = async (data: AdvertiserFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an organization",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const organizationsApi = await createApiClient(OrganizationsApi);
      
      const advertiserExtraInfo: HandlersAdvertiserExtraInfoRequest = {
        website: data.website || undefined,
        websiteType: data.websiteType as any,
        companySize: data.companySize as any,
      };

      const createRequest: HandlersCreateOrganizationRequest = {
        name: data.organizationName,
        description: data.description,
        contactEmail: data.contactEmail,
        type: 'advertiser',
        advertiserExtraInfo,
      };

      const response = await organizationsApi.organizationsPost({
        request: createRequest,
      });

      // Create profile for the user
      if (response.organizationId) {
        const profileApi = await createApiClient(ProfileApi);
        await profileApi.profilesPost({
          profile: {
            email: user.email,
            firstName: user.user_metadata?.first_name,
            lastName: user.user_metadata?.last_name,
            organizationId: response.organizationId,
            roleId: 1 // Default role, adjust as needed
          }
        });
      }

      // Refresh the profile to update auth context and invalidate queries
      await fetchBackendProfile();
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['organization'] });

      toast({
        title: t('organizations.organizationCreated'),
        description: "Your advertiser organization and profile have been created successfully",
      });

      // Reload the website after successful creation
      window.location.reload();
    } catch (error) {
      console.error('Error creating advertiser organization:', error);
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Advertiser Organization</CardTitle>
          <CardDescription>
            Set up your advertiser organization to start promoting your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organizationName">{t('organizations.organizationName')}</Label>
              <Input
                id="organizationName"
                {...form.register('organizationName')}
                placeholder="Enter your organization name"
              />
              {form.formState.errors.organizationName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.organizationName.message}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">{t('organizations.website')}</Label>
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
              <Label htmlFor="industry">{t('organizations.industry')}</Label>
              <Input
                id="industry"
                {...form.register('industry')}
                placeholder="e.g. Technology, Fashion, Health"
              />
              {form.formState.errors.industry && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.industry.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize">{t('organizations.companySize')}</Label>
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

            <div className="flex gap-4">
              <Link to="/onboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? t('organizations.saving') : 'Create Organization'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertiserOnboard;