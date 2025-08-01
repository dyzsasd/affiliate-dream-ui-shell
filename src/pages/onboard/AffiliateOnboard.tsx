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
import { HandlersCreateOrganizationRequest, HandlersAffiliateExtraInfoRequest, HandlersAffiliateExtraInfoRequestAffiliateTypeEnum } from '@/generated-api/src/models';
import { createPublicApiClient } from '@/services/backendApi';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Mail } from 'lucide-react';

const onboardSchema = z.object({
  domain: z.string().min(1, 'Domain is required').regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/, 'Please enter a valid domain'),
  email: z.string().email('Please enter a valid email address'),
  affiliateType: z.string().min(1, 'Please select an affiliate type'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  selfDescription: z.string().min(10, 'Please provide at least 10 characters description'),
  logoUrl: z.string().url('Please enter a valid logo URL').optional().or(z.literal(''))
});

type OnboardFormData = z.infer<typeof onboardSchema>;

export const AffiliateOnboard: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      // Create organization with affiliate extra info using public endpoint
      const organizationsApi = createPublicApiClient(OrganizationsApi);
      
      const affiliateExtraInfo: HandlersAffiliateExtraInfoRequest = {
        affiliateType: data.affiliateType as HandlersAffiliateExtraInfoRequestAffiliateTypeEnum,
        website: data.website || undefined,
        selfDescription: data.selfDescription,
        logoUrl: data.logoUrl || undefined
      };

      const createOrgRequest: HandlersCreateOrganizationRequest = {
        name: data.domain,
        type: 'affiliate',
        contactEmail: data.email,
        affiliateExtraInfo: affiliateExtraInfo
      };
      
      const organization = await organizationsApi.apiV1PublicOrganizationsPost({
        request: createOrgRequest
      });

      // Send invitation email with organization details
      const response = await fetch('https://plhilkfckdgcdewulspe.supabase.co/functions/v1/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          organizationId: organization.organizationId,
          organizationName: organization.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation email');
      }

      setIsSuccess(true);
      toast({
        title: "Organization created successfully",
        description: `We've sent an invitation email to ${data.email}. Please check your inbox to complete the registration.`,
      });
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

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent you an invitation email with instructions to complete your registration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or contact support.
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link to="/auth/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register('email')}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                We'll send an invitation to this email
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
                  <SelectItem value="influencer">Influencer</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                  <SelectItem value="coupon">Coupon</SelectItem>
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

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Organization..." : "Create Organization & Send Invitation"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth/login">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};