import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdvertisersApi } from '@/generated-api/src/apis/AdvertisersApi';
import { ModelsCreateAdvertiserRequest } from '@/generated-api/src/models';
import { createApiClient } from '@/services/backendApi';

const advertiserSchema = z.object({
  name: z.string().min(1, 'Advertiser name is required'),
  contactEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  platformName: z.string().optional(),
  platformUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  internalNotes: z.string().optional(),
  status: z.enum(['active', 'pending', 'inactive'], {
    required_error: 'Please select a status',
  }),
});

type AdvertiserFormData = z.infer<typeof advertiserSchema>;

interface CreateAdvertiserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAdvertiserModal: React.FC<CreateAdvertiserModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { organization } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<AdvertiserFormData>({
    resolver: zodResolver(advertiserSchema),
    defaultValues: {
      name: '',
      contactEmail: '',
      platformName: '',
      platformUrl: '',
      internalNotes: '',
      status: 'pending',
    },
  });

  const onSubmit = async (data: AdvertiserFormData) => {
    if (!organization?.organizationId) {
      toast({
        title: "Error",
        description: "No organization found. Please ensure you're logged in.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const advertisersApi = await createApiClient(AdvertisersApi);
      
      const createRequest: ModelsCreateAdvertiserRequest = {
        name: data.name,
        organizationId: organization.organizationId,
        contactEmail: data.contactEmail || undefined,
        platformName: data.platformName || undefined,
        platformUrl: data.platformUrl || undefined,
        internalNotes: data.internalNotes || undefined,
        status: data.status,
      };

      await advertisersApi.advertisersPost({
        request: createRequest,
      });

      // Invalidate and refetch advertisers list
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });

      toast({
        title: "Advertiser created",
        description: `${data.name} has been created successfully.`,
      });

      // Reset form and close modal
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating advertiser:', error);
      toast({
        title: "Error",
        description: "Failed to create advertiser. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Advertiser</DialogTitle>
          <DialogDescription>
            Add a new advertiser to your organization.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Advertiser Name *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Enter advertiser name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              {...form.register('contactEmail')}
              placeholder="contact@example.com"
            />
            {form.formState.errors.contactEmail && (
              <p className="text-sm text-destructive">
                {form.formState.errors.contactEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={form.watch('status')}
              onValueChange={(value) => form.setValue('status', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-sm text-destructive">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="platformName">Platform Name</Label>
            <Input
              id="platformName"
              {...form.register('platformName')}
              placeholder="e.g., Shopify, WooCommerce"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platformUrl">Platform URL</Label>
            <Input
              id="platformUrl"
              {...form.register('platformUrl')}
              placeholder="https://example.com"
            />
            {form.formState.errors.platformUrl && (
              <p className="text-sm text-destructive">
                {form.formState.errors.platformUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalNotes">Internal Notes</Label>
            <Textarea
              id="internalNotes"
              {...form.register('internalNotes')}
              placeholder="Any internal notes about this advertiser..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Advertiser'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};