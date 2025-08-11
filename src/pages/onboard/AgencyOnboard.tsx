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
import { HandlersCreateOrganizationRequest } from '@/generated-api/src/models';
import { createPublicApiClient, createApiClient } from '@/services/backendApi';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';

const agencySchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  contactEmail: z.string().email('Please enter a valid email'),
});

type AgencyFormData = z.infer<typeof agencySchema>;

export const AgencyOnboard: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, fetchBackendProfile } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema),
    defaultValues: {
      organizationName: '',
      description: '',
      website: '',
      contactEmail: user?.email || '',
    },
  });

  const onSubmit = async (data: AgencyFormData) => {
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
      
      const createRequest: HandlersCreateOrganizationRequest = {
        name: data.organizationName,
        description: data.description,
        contactEmail: data.contactEmail,
        type: 'agency',
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
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['organization'] });

      toast({
        title: t('organizations.organizationCreated'),
        description: "Your agency organization and profile have been created successfully",
      });

      // Reload the website after successful creation
      window.location.reload();
    } catch (error) {
      console.error('Error creating agency organization:', error);
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
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Agency Organization</CardTitle>
          <CardDescription>
            Set up your agency to manage multiple advertiser and affiliate accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organizationName">{t('organizations.organizationName')}</Label>
              <Input
                id="organizationName"
                {...form.register('organizationName')}
                placeholder="Enter your agency name"
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
                placeholder="Describe your agency services"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">{t('organizations.website')}</Label>
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

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                {...form.register('contactEmail')}
                placeholder="contact@youragency.com"
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

export default AgencyOnboard;