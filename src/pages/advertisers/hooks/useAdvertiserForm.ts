
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth';
import { fetchAdvertiser } from '@/services/advertiserService';
import { advertiserSchema, AdvertiserFormData, BillingDetails } from '../types/advertiser';
import { useAdvertiserMutations } from './useAdvertiserMutations';
import { DomainAffiliate, DomainBillingDetails } from '@/generated-api/src/models';

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
      billingDetails: '',
    },
  });

  // Update form when advertiser data is loaded
  useEffect(() => {
    if (advertiser && isEditMode) {
      let billingDetails: BillingDetails = {};
      let billingDetailsString = '';
      
      if (advertiser.billingDetails) {
        if (typeof advertiser.billingDetails === 'string') {
          try {
            billingDetails = JSON.parse(advertiser.billingDetails) as BillingDetails;
            billingDetailsString = advertiser.billingDetails;
          } catch (e) {
            billingDetails = {};
            billingDetailsString = '';
          }
        } else {
          // If it's already a DomainBillingDetails object, convert it
          const domainBillingDetails = advertiser.billingDetails as DomainBillingDetails;
          billingDetails = {
            address: domainBillingDetails.address?.line1 || '',
            city: domainBillingDetails.address?.city || '',
            state: domainBillingDetails.address?.state || '',
            country: domainBillingDetails.address?.country || '',
            postalCode: domainBillingDetails.address?.postalCode || ''
          };
          billingDetailsString = JSON.stringify(domainBillingDetails);
        }
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
        billingDetails: billingDetailsString,
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
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingCountry: '',
      billingPostalCode: '',
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
