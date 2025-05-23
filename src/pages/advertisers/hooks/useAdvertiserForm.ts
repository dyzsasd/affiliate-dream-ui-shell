
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import { fetchAdvertiser, createAdvertiser, updateAdvertiser } from '@/services/advertiserService';
import { advertiserSchema, AdvertiserFormData, BillingDetails } from '../types/advertiser';

interface UseAdvertiserFormProps {
  advertiserId?: string;
}

export const useAdvertiserForm = ({ advertiserId }: UseAdvertiserFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
  useEffect(() => {
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

  return {
    form,
    isEditMode,
    isSubmitting,
    isAdvertiserLoading,
    onSubmit,
    handleCancel
  };
};
