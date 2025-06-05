
import { z } from 'zod';

export const advertiserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactEmail: z.string().email('Valid email is required'),
  status: z.enum(['active', 'pending', 'inactive', 'rejected']),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingCountry: z.string().optional(),
  billingPostalCode: z.string().optional(),
  billingDetails: z.string().optional(), // Add this field
});

export type AdvertiserFormData = z.infer<typeof advertiserSchema>;

export interface BillingDetails {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}
