import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { OrganizationsApi } from '@/generated-api/src/apis';
import { ProfileApi } from '@/generated-api/src/apis/ProfileApi';
import { HandlersCreateOrganizationRequest, HandlersAffiliateExtraInfoRequest, HandlersAffiliateExtraInfoRequestAffiliateTypeEnum } from '@/generated-api/src/models';
import { createPublicApiClient, createApiClient } from '@/services/backendApi';
import { useAuth } from '@/contexts/auth';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Mail } from 'lucide-react';

const onboardSchema = z.object({
  domain: z.string().min(1, 'Domain is required').regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/, 'Please enter a valid domain'),
  affiliateType: z.string().min(1, 'Please select an affiliate type'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  selfDescription: z.string().min(10, 'Please provide at least 10 characters description'),
  logoUrl: z.string().url('Please enter a valid logo URL').optional().or(z.literal(''))
});

type OnboardFormData = z.infer<typeof onboardSchema>;

export const AffiliateOnboard: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, fetchBackendProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OnboardFormData>({
    resolver: zodResolver(onboardSchema),
  });

  const onSubmit = async (data: OnboardFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create organization with affiliate extra info
      const organizationsApi = await createApiClient(OrganizationsApi);
      
      const affiliateExtraInfo: HandlersAffiliateExtraInfoRequest = {
        affiliateType: data.affiliateType as HandlersAffiliateExtraInfoRequestAffiliateTypeEnum,
        website: data.website || undefined,
        selfDescription: data.selfDescription,
        logoUrl: data.logoUrl || undefined
      };

      const createOrgRequest: HandlersCreateOrganizationRequest = {
        name: data.domain,
        type: 'affiliate',
        contactEmail: user?.email || '',
        affiliateExtraInfo: affiliateExtraInfo
      };
      
      const organization = await organizationsApi.organizationsPost({
        request: createOrgRequest
      });

      // Create profile for the user
      if (user && organization.organizationId) {
        const profileApi = await createApiClient(ProfileApi);
        await profileApi.profilesPost({
          profile: {
            email: user.email,
            firstName: user.user_metadata?.first_name,
            lastName: user.user_metadata?.last_name,
            organizationId: organization.organizationId,
            roleId: 1 // Default role, adjust as needed
          }
        });
      }

      // Refresh the profile to update auth context
      await fetchBackendProfile();

      toast({
        title: "Organization created successfully",
        description: "Your affiliate organization and profile have been created.",
      });

      // Navigate to dashboard after successful creation
      navigate('/');

    } catch (error: any) {
      toast({
        title: "Error creating organization",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Join as Affiliate</CardTitle>
          <CardDescription>
            Create your organization and get started with our affiliate platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Organization Domain</Label>
              <Input
                id="domain"
                type="text"
                placeholder="example.com"
                {...register('domain')}
                className={errors.domain ? "border-destructive" : ""}
              />
              {errors.domain && (
                <p className="text-sm text-destructive">{errors.domain.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                This will be used as your organization name
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliateType">Affiliate Type</Label>
              <Select onValueChange={(value) => setValue('affiliateType', value)}>
                <SelectTrigger className={errors.affiliateType ? "border-destructive" : ""}>
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
              {errors.affiliateType && (
                <p className="text-sm text-destructive">{errors.affiliateType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://your-website.com"
                {...register('website')}
                className={errors.website ? "border-destructive" : ""}
              />
              {errors.website && (
                <p className="text-sm text-destructive">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="selfDescription">Description</Label>
              <Textarea
                id="selfDescription"
                placeholder="Tell us about your affiliate business and audience..."
                {...register('selfDescription')}
                className={errors.selfDescription ? "border-destructive" : ""}
                rows={4}
              />
              {errors.selfDescription && (
                <p className="text-sm text-destructive">{errors.selfDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
              <Input
                id="logoUrl"
                type="url"
                placeholder="https://your-logo.com/logo.png"
                {...register('logoUrl')}
                className={errors.logoUrl ? "border-destructive" : ""}
              />
              {errors.logoUrl && (
                <p className="text-sm text-destructive">{errors.logoUrl.message}</p>
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
                {isSubmitting ? "Creating..." : "Create Organization"}
              </Button>
            </div>
          </form>

        </CardContent>
      </Card>
    </div>
  );
};