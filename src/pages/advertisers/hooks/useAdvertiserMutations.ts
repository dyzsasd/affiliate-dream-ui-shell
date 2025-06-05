
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
    mutationFn: async (data: AdvertiserFormData) => {
      const billingDetailsObj = prepareBillingDetails(data);
      const transformedData = {
        name: data.name,
        contactEmail: data.contactEmail,
        status: data.status,
        // Map billingDetails to paymentDetails for affiliate backend
        paymentDetails: billingDetailsObj ? JSON.stringify(billingDetailsObj) : undefined,
      };
      
      return createAdvertiser(organizationId, transformedData);
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
      if (!advertiserId) throw new Error('Advertiser ID is required');
      
      const billingDetailsObj = prepareBillingDetails(data);
      const transformedData = {
        name: data.name,
        contactEmail: data.contactEmail,
        status: data.status,
        // Map billingDetails to paymentDetails for affiliate backend
        paymentDetails: billingDetailsObj ? JSON.stringify(billingDetailsObj) : undefined,
      };
      
      return updateAdvertiser(parseInt(advertiserId), transformedData);
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
