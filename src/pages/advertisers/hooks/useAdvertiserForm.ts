import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth';
import { fetchAdvertiser } from '@/services/advertiserService';
import { advertiserSchema, AdvertiserFormData, BillingDetails } from '../types/advertiser';
import { useAdvertiserMutations } from './useAdvertiserMutations';

interface UseAdvertiserFormProps {
  advertiserId?: string;
}

export const useAdvertiserForm = ({ advertiserId }: UseAdvertiserFormProps) => {
  const navigate = useNavigate();
  const { organization } = useAuth();
  const isEditMode = !!advertiserId;
  const organizationId = organization?.organizationId;

  // Use our extracted mutation hook
  const { submitForm, isSubmitting } = useAdvertiserMutations({
    advertiserId,
    organizationId
  });

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

  const transformFormDataToBackend = (data: AdvertiserFormData) => {
    return {
      name: data.name,
      contactEmail: data.contactEmail,
      status: data.status,
      // Map billingDetails to paymentDetails for the affiliate backend
      paymentDetails: data.billingDetails ? JSON.parse(data.billingDetails) : undefined,
    };
  };

  const transformBackendToFormData = (advertiser: DomainAffiliate): AdvertiserFormData => {
    let billingDetails = '';
    
    // Try to get billing info from either billingInfo or paymentDetails
    if (advertiser.billingInfo) {
      billingDetails = advertiser.billingInfo;
    } else if (advertiser.paymentDetails) {
      billingDetails = advertiser.paymentDetails;
    }

    return {
      name: advertiser.name || '',
      contactEmail: advertiser.contactEmail || '',
      status: (advertiser.status as 'active' | 'pending' | 'inactive' | 'rejected') || 'pending',
      // Use the billing details we found
      billingDetails: billingDetails
    };
  };

  const onSubmit = (data: AdvertiserFormData) => {
    submitForm(data);
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
