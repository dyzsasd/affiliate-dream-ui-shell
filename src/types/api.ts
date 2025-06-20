
export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignDetail {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'draft';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  offers?: Offer[];
  
  // Additional fields from ModelsCampaignResponse
  campaignId?: number;
  advertiserId?: number;
  organizationId?: number;
  destinationUrl?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  visibility?: string;
  currencyId?: string;
  billingModel?: string;
  payoutType?: string;
  payoutAmount?: number;
  payoutStructure?: string;
  revenueType?: string;
  revenueAmount?: number;
  revenueStructure?: string;
  conversionMethod?: string;
  sessionDefinition?: string;
  sessionDuration?: number;
  termsAndConditions?: string;
  internalNotes?: string;
  
  // Caps and limits
  isCapsEnabled?: boolean;
  dailyClickCap?: number;
  dailyConversionCap?: number;
  weeklyClickCap?: number;
  weeklyConversionCap?: number;
  monthlyClickCap?: number;
  monthlyConversionCap?: number;
  globalClickCap?: number;
  globalConversionCap?: number;
}

export interface Offer {
  id: string;
  name: string;
  payoutType: 'CPA' | 'RevShare' | 'Hybrid';
  payoutAmount: number;
  description?: string;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
}

export interface TrackingLinkParams {
  campaignId: string;
  offerId: string;
  sub1?: string;
  sub2?: string;
  sub3?: string;
  deepLink?: string;
}

export interface TrackingLink {
  url: string;
  campaignId: string;
  offerId: string;
}

export interface PerformanceData {
  date: string;
  clicks: number;
  impressions: number;
  conversions: number;
  revenue: number;
}

export interface Conversion {
  id: string;
  timestamp: string;
  transactionId: string;
  campaignId: string;
  offerId: string;
  status: 'pending' | 'approved' | 'rejected';
  payout: number;
  currency: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}
