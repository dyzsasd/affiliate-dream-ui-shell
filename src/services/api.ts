import { Campaign, CampaignDetail, Conversion, PerformanceData, TrackingLink, TrackingLinkParams, PaginatedResponse } from '../types/api';
import { getMockPerformanceData } from './mockDashboardData';

// This would be set via environment variable in a real application
const API_BASE_URL = 'https://mock-api-url.com';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API request failed with status ${response.status}`);
    }

    return response.json();
  }

  // Campaign endpoints
  async getCampaigns(): Promise<Campaign[]> {
    // For demo purposes, return mock data
    return this.request<Campaign[]>('/campaigns');
  }

  async getCampaign(id: string): Promise<CampaignDetail> {
    return this.request<CampaignDetail>(`/campaigns/${id}`);
  }

  // Tracking link endpoints
  async generateTrackingLink(params: TrackingLinkParams): Promise<TrackingLink> {
    return this.request<TrackingLink>('/tracking/links', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Reporting endpoints
  async getPerformanceReport(startDate?: string, endDate?: string): Promise<PerformanceData[]> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request<PerformanceData[]>(`/reporting/performance${query}`);
  }

  async getConversionsReport(page = 1, limit = 10): Promise<PaginatedResponse<Conversion>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return this.request<PaginatedResponse<Conversion>>(`/reporting/conversions?${queryParams.toString()}`);
  }
}

// Create a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Generate mock data using the new service
export const mockPerformanceData = getMockPerformanceData(30).map(item => ({
  date: item.date,
  clicks: item.clicks,
  conversions: item.conversions,
  revenue: item.revenue,
  impressions: item.impressions
}));

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    description: 'Promotional campaign for summer products',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-06-01T09:00:00Z'
  },
  {
    id: '2',
    name: 'Holiday Promotions', 
    description: 'End of year holiday campaign',
    status: 'active',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2024-11-01T09:00:00Z'
  },
  {
    id: '3',
    name: 'New Product Launch',
    description: 'Campaign for launching new product line',
    status: 'draft',
    startDate: '2024-09-01',
    endDate: '2024-10-31',
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2024-08-20T09:00:00Z'
  }
];

export const mockCampaignDetail: CampaignDetail = {
  id: '1',
  name: 'Summer Sale 2024',
  description: 'Comprehensive summer promotional campaign featuring discounts on seasonal products',
  status: 'active',
  startDate: '2024-06-01',
  endDate: '2024-08-31',
  createdAt: '2024-05-15T10:00:00Z',
  updatedAt: '2024-06-01T09:00:00Z',
  offers: [
    {
      id: 'offer-1',
      name: '20% Summer Discount',
      description: '20% off on all summer products',
      payoutType: 'RevShare',
      payoutAmount: 15
    },
    {
      id: 'offer-2',
      name: 'Free Shipping Offer',
      description: 'Free shipping on orders over $50',
      payoutType: 'CPA',
      payoutAmount: 5
    }
  ]
};

export const mockConversions: Conversion[] = Array.from({ length: 50 }, (_, index) => ({
  id: `conv-${index + 1}`,
  timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  transactionId: `tx-${index + 1}`,
  campaignId: `campaign-${(index % 3) + 1}`,
  offerId: `offer-${(index % 2) + 1}`,
  status: Math.random() > 0.1 ? 'approved' : 'pending',
  payout: Number((Math.random() * 15 + 5).toFixed(2)),
  currency: 'USD'
}));

export const mockPaginatedConversions: PaginatedResponse<Conversion> = {
  data: mockConversions.slice(0, 10),
  meta: {
    totalItems: mockConversions.length,
    itemCount: 10,
    itemsPerPage: 10,
    totalPages: Math.ceil(mockConversions.length / 10),
    currentPage: 1
  }
};
