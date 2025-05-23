
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { createAdvertiser, updateAdvertiser } from '@/services/advertiserService';
import { AdvertiserFormData, BillingDetails } from '../types/advertiser';

interface UseAdvertiserMutationsProps {
  advertiserId?: string;
  organizationId?: number;
}

export const useAdvertiserMutations = ({ advertiserId, organizationId }: UseAdvertiserMutationsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!advertiserId;

  // Prepare billing details for API request
  const prepareBillingDetails = (data: AdvertiserFormData) => {
    // Structure billing details into an object
    const billingDetailsObj: BillingDetails = {
      address: data.billingAddress || undefined,
      city: data.billingCity || undefined,
      state: data.billingState || undefined,
      country: data.billingCountry || undefined,
      postalCode: data.billingPostalCode || undefined,
    };
    
    // Only include billing details if at least one field is populated
    return Object.values(billingDetailsObj).some(val => !!val) ? billingDetailsObj : undefined;
  };

  const createMutation = useMutation({
    mutationFn: (data: AdvertiserFormData) => {
      if (!organizationId) {
        throw new Error("No organization ID available");
      }
      
      const billingDetails = prepareBillingDetails(data);
      
      return createAdvertiser(organizationId, {
        name: data.name,
        contactEmail: data.contactEmail || undefined,
        billingDetails,
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
      
      const billingDetails = prepareBillingDetails(data);
      
      return updateAdvertiser(Number(advertiserId), {
        name: data.name,
        contactEmail: data.contactEmail || undefined,
        billingDetails,
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

  const submitForm = (data: AdvertiserFormData) => {
    setIsSubmitting(true);
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return {
    submitForm,
    isSubmitting
  };
};
