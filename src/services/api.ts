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

// Empty data exports since mock data removed
export const mockCampaigns: Campaign[] = [];
export const mockCampaignDetail: CampaignDetail = {
  id: '1',
  name: '',
  description: '',
  status: 'draft',
  startDate: '',
  endDate: '',
  createdAt: '',
  updatedAt: '',
  offers: []
};
export const mockPerformanceData: PerformanceData[] = [];
export const mockConversions: Conversion[] = [];
export const mockPaginatedConversions: PaginatedResponse<Conversion> = {
  data: [],
  meta: {
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 10,
    totalPages: 0,
    currentPage: 1
  }
};
