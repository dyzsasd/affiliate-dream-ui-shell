
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
    return {
      address: {
        line1: data.billingAddress || '',
        city: data.billingCity || '',
        state: data.billingState || '',
        country: data.billingCountry || '',
        postalCode: data.billingPostalCode || ''
      },
      taxId: data.billingTaxId || ''
    };
  };

  const createMutation = useMutation({
    mutationFn: async (data: AdvertiserFormData) => {
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }

      const billingDetails = prepareBillingDetails(data);
      
      return createAdvertiser(organizationId, {
        name: data.name,
        contactEmail: data.contactEmail || undefined,
        accountingContactEmail: data.accountingContactEmail || undefined,
        status: data.status,
        platformName: data.platformName || undefined,
        platformUrl: data.platformUrl || undefined,
        platformUsername: data.platformUsername || undefined,
        attributionMethod: data.attributionMethod || undefined,
        attributionPriority: data.attributionPriority || undefined,
        emailAttributionMethod: data.emailAttributionMethod || undefined,
        affiliateIdMacro: data.affiliateIdMacro || undefined,
        offerIdMacro: data.offerIdMacro || undefined,
        defaultCurrencyId: data.defaultCurrencyId || undefined,
        reportingTimezoneId: data.reportingTimezoneId ? parseInt(data.reportingTimezoneId) : undefined,
        internalNotes: data.internalNotes || undefined,
        billingDetails: billingDetails
      });
    },
    onSuccess: () => {
      toast.success("Advertiser created successfully");
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      navigate('/advertisers');
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create advertiser");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AdvertiserFormData) => {
      if (!advertiserId) {
        throw new Error('Advertiser ID is required for update');
      }

      const billingDetails = prepareBillingDetails(data);
      
      return updateAdvertiser(Number(advertiserId), {
        name: data.name,
        contactEmail: data.contactEmail || undefined,
        accountingContactEmail: data.accountingContactEmail || undefined,
        status: data.status,
        platformName: data.platformName || undefined,
        platformUrl: data.platformUrl || undefined,
        platformUsername: data.platformUsername || undefined,
        attributionMethod: data.attributionMethod || undefined,
        attributionPriority: data.attributionPriority || undefined,
        emailAttributionMethod: data.emailAttributionMethod || undefined,
        affiliateIdMacro: data.affiliateIdMacro || undefined,
        offerIdMacro: data.offerIdMacro || undefined,
        defaultCurrencyId: data.defaultCurrencyId || undefined,
        reportingTimezoneId: data.reportingTimezoneId ? parseInt(data.reportingTimezoneId) : undefined,
        internalNotes: data.internalNotes || undefined,
        billingDetails: billingDetails
      });
    },
    onSuccess: () => {
      toast.success("Advertiser updated successfully");
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      queryClient.invalidateQueries({ queryKey: ['advertiser', advertiserId] });
      navigate('/advertisers');
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update advertiser");
    },
  });

  const submitForm = (data: AdvertiserFormData) => {
    setIsSubmitting(true);
    const mutationToUse = isEditMode ? updateMutation : createMutation;
    
    mutationToUse.mutate(data, {
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  return {
    submitForm,
    isSubmitting
  };
};
