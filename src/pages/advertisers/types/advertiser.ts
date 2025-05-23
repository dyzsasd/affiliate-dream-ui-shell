
import { z } from 'zod';

// Define the billing details interface
export interface BillingDetails {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export const advertiserSchema = z.object({
  name: z.string().min(1, { message: "Advertiser name is required" }),
  contactEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  status: z.enum(['active', 'pending', 'inactive', 'rejected']),
  billingAddress: z.string().optional().or(z.literal('')),
  billingCity: z.string().optional().or(z.literal('')),
  billingState: z.string().optional().or(z.literal('')),
  billingCountry: z.string().optional().or(z.literal('')),
  billingPostalCode: z.string().optional().or(z.literal('')),
});

export type AdvertiserFormData = z.infer<typeof advertiserSchema>;
