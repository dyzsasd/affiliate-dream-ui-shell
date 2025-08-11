
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
      // Mandatory fields
      name: '',
      status: 'pending',
      
      // Contact information
      contactEmail: '',
      accountingContactEmail: '',
      
      // Platform details
      platformName: '',
      platformUrl: '',
      platformUsername: '',
      
      // Attribution settings
      attributionMethod: '',
      attributionPriority: '',
      emailAttributionMethod: '',
      
      // Macros
      affiliateIdMacro: '',
      offerIdMacro: '',
      
      // Settings
      defaultCurrencyId: '',
      reportingTimezoneId: '',
      internalNotes: '',
      
      // Billing address
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingCountry: '',
      billingPostalCode: '',
      billingTaxId: '',
    },
  });

  // Update form when advertiser data is loaded
  useEffect(() => {
    if (advertiser && isEditMode) {
      let billingDetails: BillingDetails = {};
      
      if (advertiser.billingDetails) {
        if (typeof advertiser.billingDetails === 'string') {
          try {
            billingDetails = JSON.parse(advertiser.billingDetails) as BillingDetails;
          } catch (e) {
            billingDetails = {};
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
        }
      }
      
      form.reset({
        // Mandatory fields
        name: advertiser.name || '',
        status: (advertiser.status as 'active' | 'pending' | 'inactive' | 'rejected') || 'pending',
        
        // Contact information
        contactEmail: advertiser.contactEmail || '',
        accountingContactEmail: advertiser.accountingContactEmail || '',
        
        // Platform details
        platformName: advertiser.platformName || '',
        platformUrl: advertiser.platformUrl || '',
        platformUsername: advertiser.platformUsername || '',
        
        // Attribution settings
        attributionMethod: advertiser.attributionMethod || '',
        attributionPriority: advertiser.attributionPriority || '',
        emailAttributionMethod: advertiser.emailAttributionMethod || '',
        
        // Macros
        affiliateIdMacro: advertiser.affiliateIdMacro || '',
        offerIdMacro: advertiser.offerIdMacro || '',
        
        // Settings
        defaultCurrencyId: advertiser.defaultCurrencyId || '',
        reportingTimezoneId: advertiser.reportingTimezoneId?.toString() || '',
        internalNotes: advertiser.internalNotes || '',
        
        // Billing address
        billingAddress: billingDetails.address || '',
        billingCity: billingDetails.city || '',
        billingState: billingDetails.state || '',
        billingCountry: billingDetails.country || '',
        billingPostalCode: billingDetails.postalCode || '',
        billingTaxId: (advertiser.billingDetails as any)?.taxId || '',
      });
    }
  }, [advertiser, form, isEditMode]);


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
