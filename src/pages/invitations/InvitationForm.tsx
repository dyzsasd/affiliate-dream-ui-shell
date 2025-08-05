import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvitationService } from '@/services/invitationApi';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { DomainCreateInvitationRequest, DomainUpdateInvitationRequest } from '@/generated-api/src/models';

const invitationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().optional(),
  maxUses: z.number().min(1, 'Must be at least 1').optional(),
  expiresAt: z.string().optional(),
  message: z.string().optional(),
  defaultAllAffiliatesVisible: z.boolean().default(true),
  defaultAllCampaignsVisible: z.boolean().default(true),
  allowedAffiliateOrgIds: z.array(z.number()).optional(),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

export default function InvitationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const isEdit = Boolean(id);

  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      name: '',
      description: '',
      message: '',
      defaultAllAffiliatesVisible: true,
      defaultAllCampaignsVisible: true,
    },
  });

  // Load existing invitation for editing
  const { data: invitation, isLoading } = useQuery({
    queryKey: ['invitation', id],
    queryFn: () => InvitationService.getInvitation(Number(id)),
    enabled: isEdit && !!id,
  });

  // Populate form when invitation data loads
  useEffect(() => {
    if (invitation && isEdit) {
      form.reset({
        name: invitation.name || '',
        description: invitation.description || '',
        message: invitation.message || '',
        maxUses: invitation.maxUses || undefined,
        expiresAt: invitation.expiresAt ? new Date(invitation.expiresAt).toISOString().slice(0, 16) : '',
        defaultAllAffiliatesVisible: invitation.defaultAllAffiliatesVisible ?? true,
        defaultAllCampaignsVisible: invitation.defaultAllCampaignsVisible ?? true,
      });
    }
  }, [invitation, isEdit, form]);

  const createMutation = useMutation({
    mutationFn: (data: DomainCreateInvitationRequest) => InvitationService.createInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      toast({
        title: t('invitations.success'),
        description: t('invitations.created')
      });
      navigate('/invitations');
    },
    onError: () => {
      toast({
        title: t('invitations.error'),
        description: t('invitations.saveError'),
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DomainUpdateInvitationRequest }) => 
      InvitationService.updateInvitation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['invitation', id] });
      toast({
        title: t('invitations.success'),
        description: t('invitations.updated')
      });
      navigate('/invitations');
    },
    onError: () => {
      toast({
        title: t('invitations.error'),
        description: t('invitations.saveError'),
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InvitationFormData) => {
    if (!profile?.organization?.id) {
      toast({
        title: t('invitations.error'),
        description: t('invitations.organizationNotFound'),
        variant: "destructive"
      });
      return;
    }

    const payload = {
      ...data,
      advertiserOrgId: profile.organization.id,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
    };

    if (isEdit && id) {
      updateMutation.mutate({ id: Number(id), data: payload });
    } else {
      createMutation.mutate(payload as DomainCreateInvitationRequest);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/invitations')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? t('invitations.editInvitation') : t('invitations.createInvitation')}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? t('invitations.updateInvitationSettings') : t('invitations.createNewAffiliateInvitation')}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t('invitations.invitationDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('invitations.invitationNameRequired')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('invitations.partnerProgramInvitation')} {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('invitations.descriptiveNameForInvitation')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('invitations.usageLimit')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t('invitations.unlimited')}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('invitations.maxNumberOfUses')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('invitations.invitationDescription')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('invitations.joinAffiliateProgram')}
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('invitations.optionalDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('invitations.expirationDate')}</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('invitations.whenInvitationExpires')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('invitations.welcomeMessage')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('invitations.welcomeToAffiliate')}
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('invitations.customMessageShown')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Default Visibility Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('invitations.defaultVisibilitySettings')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('invitations.settingsApplyToNew')}
                </p>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultAllAffiliatesVisible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {t('invitations.makeAllAffiliatesVisible')}
                          </FormLabel>
                          <FormDescription>
                            {t('invitations.newAssociationsAffiliates')}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultAllCampaignsVisible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {t('invitations.makeAllCampaignsVisible')}
                          </FormLabel>
                          <FormDescription>
                            {t('invitations.newAssociationsCampaigns')}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? t('invitations.saving') : isEdit ? t('invitations.updateInvitation') : t('invitations.createInvitation')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/invitations')}
                >
                  {t('invitations.cancel')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}