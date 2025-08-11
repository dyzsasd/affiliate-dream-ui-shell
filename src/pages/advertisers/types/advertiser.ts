
import { z } from 'zod';

export const advertiserSchema = z.object({
  // Mandatory fields
  name: z.string().min(1, 'Name is required'),
  status: z.enum(['active', 'pending', 'inactive', 'rejected']),
  
  // Contact information
  contactEmail: z.string().email('Valid email is required').optional().or(z.literal('')),
  accountingContactEmail: z.string().email('Valid email is required').optional().or(z.literal('')),
  
  // Platform details
  platformName: z.string().optional(),
  platformUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  platformUsername: z.string().optional(),
  
  // Attribution settings
  attributionMethod: z.string().optional(),
  attributionPriority: z.string().optional(),
  emailAttributionMethod: z.string().optional(),
  
  // Macros
  affiliateIdMacro: z.string().optional(),
  offerIdMacro: z.string().optional(),
  
  // Settings
  defaultCurrencyId: z.string().optional(),
  reportingTimezoneId: z.string().optional(),
  internalNotes: z.string().optional(),
  
  // Billing address (simplified)
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingCountry: z.string().optional(),
  billingPostalCode: z.string().optional(),
  billingTaxId: z.string().optional(),
});

export type AdvertiserFormData = z.infer<typeof advertiserSchema>;

export interface BillingDetails {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}
