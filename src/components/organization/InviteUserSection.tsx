import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type InviteUserData = z.infer<typeof inviteSchema>;

interface InviteUserSectionProps {
  organizationId: number;
  organizationName: string;
}

export const InviteUserSection: React.FC<InviteUserSectionProps> = ({
  organizationId,
  organizationName,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<InviteUserData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: InviteUserData) => {
    setIsSubmitting(true);

    try {
      const { data: result, error } = await supabase.functions.invoke('send-invitation', {
        body: {
          email: data.email,
          organizationId,
          organizationName,
        },
      });

      if (error) {
        throw new Error(error.message || t('organizations.invitationErrorDescription'));
      }

      toast({
        title: t('organizations.invitationSent'),
        description: t('organizations.invitationSentDescription', { email: data.email }),
      });

      form.reset();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: t('organizations.invitationError'),
        description: error.message || t('organizations.invitationErrorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <UserPlus className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">{t('organizations.inviteTeamMember')}</CardTitle>
        </div>
        <CardDescription>
          {t('organizations.inviteTeamMemberDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteEmail">{t('organizations.emailAddress')}</Label>
            <Input
              id="inviteEmail"
              type="email"
              {...form.register('email')}
              placeholder={t('organizations.emailPlaceholderInvite')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {t('organizations.validEmailRequired')}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t('organizations.sendingInvitation') : t('organizations.sendInvitation')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};