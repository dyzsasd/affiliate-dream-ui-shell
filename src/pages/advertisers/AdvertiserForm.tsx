import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { fetchAdvertiser, createAdvertiser, updateAdvertiser } from '@/services/advertiserService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard, Loader2, Save } from 'lucide-react';

// Define the billing details interface
interface BillingDetails {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

const advertiserSchema = z.object({
  name: z.string().min(1, { message: "Advertiser name is required" }),
  contactEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  status: z.enum(['active', 'pending', 'inactive', 'rejected']),
  billingAddress: z.string().optional().or(z.literal('')),
  billingCity: z.string().optional().or(z.literal('')),
  billingState: z.string().optional().or(z.literal('')),
  billingCountry: z.string().optional().or(z.literal('')),
  billingPostalCode: z.string().optional().or(z.literal('')),
});

type AdvertiserFormData = z.infer<typeof advertiserSchema>;

const AdvertiserForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { advertiserId } = useParams<{ advertiserId: string }>();
  const { organization } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!advertiserId;
  const organizationId = organization?.organizationId;

  const { data: advertiser, isLoading: isAdvertiserLoading } = useQuery({
    queryKey: ['advertiser', advertiserId],
    queryFn: () => fetchAdvertiser(Number(advertiserId)),
    enabled: isEditMode && !!advertiserId,
  });

  const form = useForm<AdvertiserFormData>({
    resolver: zodResolver(advertiserSchema),
    defaultValues: {
      name: '',
      contactEmail: '',
      status: 'active',
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingCountry: '',
      billingPostalCode: '',
    },
  });

  // Update form when advertiser data is loaded
  React.useEffect(() => {
    if (advertiser && isEditMode) {
      let billingDetails: BillingDetails = {};
      
      if (typeof advertiser.billingDetails === 'string') {
        try {
          billingDetails = JSON.parse(advertiser.billingDetails) as BillingDetails;
        } catch (e) {
          billingDetails = {};
        }
      } else if (advertiser.billingDetails) {
        // If it's already an object, cast it to BillingDetails
        billingDetails = advertiser.billingDetails as unknown as BillingDetails;
      }
      
      form.reset({
        name: advertiser.name || '',
        contactEmail: advertiser.contactEmail || '',
        status: (advertiser.status as 'active' | 'pending' | 'inactive' | 'rejected') || 'active',
        billingAddress: billingDetails.address || '',
        billingCity: billingDetails.city || '',
        billingState: billingDetails.state || '',
        billingCountry: billingDetails.country || '',
        billingPostalCode: billingDetails.postalCode || '',
      });
    }
  }, [advertiser, form, isEditMode]);

  const createMutation = useMutation({
    mutationFn: (data: AdvertiserFormData) => {
      if (!organizationId) {
        throw new Error("No organization ID available");
      }
      
      // Structure billing details into an object
      const billingDetailsObj: BillingDetails = {
        address: data.billingAddress || undefined,
        city: data.billingCity || undefined,
        state: data.billingState || undefined,
        country: data.billingCountry || undefined,
        postalCode: data.billingPostalCode || undefined,
      };
      
      // Only include billing details if at least one field is populated
      const hasBillingInfo = Object.values(billingDetailsObj).some(val => !!val);
      
      return createAdvertiser(organizationId, {
        name: data.name,
        contactEmail: data.contactEmail || undefined,
        billingDetails: hasBillingInfo ? billingDetailsObj : undefined,
        status: data.status,
      });
    },
    onSuccess: () => {
      toast.success(t('advertisers.createSuccess'));
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      navigate('/advertisers');
    },
    onError: (error: Error) => {
      toast.error(t('advertisers.createError'), {
        description: error.message,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AdvertiserFormData) => {
      if (!advertiserId) {
        throw new Error("No advertiser ID available");
      }
      
      // Structure billing details into an object
      const billingDetailsObj: BillingDetails = {
        address: data.billingAddress || undefined,
        city: data.billingCity || undefined,
        state: data.billingState || undefined,
        country: data.billingCountry || undefined,
        postalCode: data.billingPostalCode || undefined,
      };
      
      // Only include billing details if at least one field is populated
      const hasBillingInfo = Object.values(billingDetailsObj).some(val => !!val);
      
      return updateAdvertiser(Number(advertiserId), {
        name: data.name,
        contactEmail: data.contactEmail || undefined,
        billingDetails: hasBillingInfo ? billingDetailsObj : undefined,
        status: data.status,
      });
    },
    onSuccess: () => {
      toast.success(t('advertisers.updateSuccess'));
      queryClient.invalidateQueries({ queryKey: ['advertiser', advertiserId] });
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      navigate('/advertisers');
    },
    onError: (error: Error) => {
      toast.error(t('advertisers.updateError'), {
        description: error.message,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: AdvertiserFormData) => {
    setIsSubmitting(true);
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    navigate('/advertisers');
  };

  if (isAdvertiserLoading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/advertisers')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? t('advertisers.editAdvertiser') : t('advertisers.createAdvertiser')}
          </CardTitle>
          <CardDescription>
            {isEditMode 
              ? t('advertisers.editAdvertiserDescription') 
              : t('advertisers.createAdvertiserDescription')}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('advertisers.nameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('advertisers.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('advertisers.emailLabel')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder={t('advertisers.emailPlaceholder')} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('advertisers.statusLabel')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('advertisers.selectStatus')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{t('advertisers.statusActive')}</SelectItem>
                        <SelectItem value="pending">{t('advertisers.statusPending')}</SelectItem>
                        <SelectItem value="inactive">{t('advertisers.statusInactive')}</SelectItem>
                        <SelectItem value="rejected">{t('advertisers.statusRejected')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5" />
                  <h3 className="text-lg font-medium">{t('advertisers.billingDetailsLabel')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('advertisers.addressLabel')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('advertisers.addressPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('advertisers.cityLabel')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('advertisers.cityPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('advertisers.stateLabel')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('advertisers.statePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('advertisers.countryLabel')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('advertisers.countryPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="billingPostalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('advertisers.postalCodeLabel')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('advertisers.postalCodePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? t('common.saveChanges') : t('common.create')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AdvertiserForm;
