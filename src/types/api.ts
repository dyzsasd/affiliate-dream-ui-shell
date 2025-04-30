
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

export interface CampaignDetail extends Campaign {
  offers: Offer[];
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
