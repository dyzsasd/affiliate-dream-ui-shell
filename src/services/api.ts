import { Campaign, CampaignDetail, Conversion, PerformanceData, TrackingLink, TrackingLinkParams, PaginatedResponse } from '../types/api';

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

// Mock data for development
export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Promotion',
    description: 'Special summer deals for new customers',
    status: 'active',
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Black Friday',
    description: 'Limited time offers for Black Friday',
    status: 'draft',
    startDate: '2023-11-24',
    endDate: '2023-11-30',
    createdAt: '2023-10-01T14:20:00Z',
    updatedAt: '2023-10-05T09:15:00Z',
  },
  {
    id: '3',
    name: 'Premium Subscription',
    description: 'Ongoing campaign for premium subscriptions',
    status: 'active',
    createdAt: '2023-01-10T08:00:00Z',
    updatedAt: '2023-03-22T16:45:00Z',
  },
];

export const mockCampaignDetail: CampaignDetail = {
  id: '1',
  name: 'Summer Promotion',
  description: 'Special summer deals for new customers',
  status: 'active',
  startDate: '2023-06-01',
  endDate: '2023-08-31',
  createdAt: '2023-05-15T10:30:00Z',
  updatedAt: '2023-05-15T10:30:00Z',
  offers: [
    {
      id: '101',
      name: 'Basic Package',
      payoutType: 'CPA',
      payoutAmount: 150.00,
      description: '$150 per new signup'
    },
    {
      id: '102',
      name: 'Premium Package',
      payoutType: 'CPA',
      payoutAmount: 300.00,
      description: '$300 per premium subscription'
    },
    {
      id: '103',
      name: 'Referral Bonus',
      payoutType: 'RevShare',
      payoutAmount: 10.00,
      description: '10% of referred customer purchases for 3 months'
    }
  ]
};

export const mockPerformanceData: PerformanceData[] = [
  { date: '2023-07-01', clicks: 2450, impressions: 35000, conversions: 120, revenue: 1800.00 },
  { date: '2023-07-02', clicks: 3120, impressions: 42000, conversions: 180, revenue: 2700.00 },
  { date: '2023-07-03', clicks: 1980, impressions: 28000, conversions: 80, revenue: 1200.00 },
  { date: '2023-07-04', clicks: 2760, impressions: 39000, conversions: 150, revenue: 2250.00 },
  { date: '2023-07-05', clicks: 3210, impressions: 43000, conversions: 190, revenue: 2850.00 },
  { date: '2023-07-06', clicks: 2670, impressions: 36000, conversions: 140, revenue: 2100.00 },
  { date: '2023-07-07', clicks: 2890, impressions: 38000, conversions: 160, revenue: 2400.00 }
];

export const mockConversions: Conversion[] = [
  { id: '1001', timestamp: '2023-07-07T14:32:15Z', transactionId: 'TX123456', campaignId: '1', offerId: '101', status: 'approved', payout: 150.00, currency: 'USD' },
  { id: '1002', timestamp: '2023-07-07T12:18:43Z', transactionId: 'TX123457', campaignId: '1', offerId: '102', status: 'approved', payout: 300.00, currency: 'USD' },
  { id: '1003', timestamp: '2023-07-07T09:45:21Z', transactionId: 'TX123458', campaignId: '1', offerId: '101', status: 'pending', payout: 150.00, currency: 'USD' },
  { id: '1004', timestamp: '2023-07-06T18:22:39Z', transactionId: 'TX123459', campaignId: '3', offerId: '103', status: 'rejected', payout: 0.00, currency: 'USD' },
  { id: '1005', timestamp: '2023-07-06T16:04:12Z', transactionId: 'TX123460', campaignId: '1', offerId: '101', status: 'approved', payout: 150.00, currency: 'USD' },
  { id: '1006', timestamp: '2023-07-06T11:51:58Z', transactionId: 'TX123461', campaignId: '1', offerId: '102', status: 'approved', payout: 300.00, currency: 'USD' },
  { id: '1007', timestamp: '2023-07-06T09:37:26Z', transactionId: 'TX123462', campaignId: '3', offerId: '103', status: 'pending', payout: 125.00, currency: 'USD' },
  { id: '1008', timestamp: '2023-07-05T20:14:53Z', transactionId: 'TX123463', campaignId: '1', offerId: '101', status: 'approved', payout: 150.00, currency: 'USD' },
  { id: '1009', timestamp: '2023-07-05T15:29:07Z', transactionId: 'TX123464', campaignId: '3', offerId: '103', status: 'approved', payout: 187.50, currency: 'USD' },
  { id: '1010', timestamp: '2023-07-05T12:43:35Z', transactionId: 'TX123465', campaignId: '1', offerId: '102', status: 'pending', payout: 300.00, currency: 'USD' }
];

export const mockPaginatedConversions: PaginatedResponse<Conversion> = {
  data: mockConversions,
  meta: {
    totalItems: 100,
    itemCount: 10,
    itemsPerPage: 10,
    totalPages: 10,
    currentPage: 1
  }
};
