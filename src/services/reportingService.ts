// Note: Since there's no ReportingApi in the generated API yet, 
// we'll create a placeholder service that would use the reporting endpoints
// once they're added to the OpenAPI spec and generated

interface ReportingApiConfig {
  basePath: string;
  headers: Record<string, string>;
}

const config: ReportingApiConfig = {
  basePath: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Performance Summary
export interface PerformanceSummaryRequest {
  startDate: string;        // ISO date format (YYYY-MM-DD)
  endDate: string;          // ISO date format (YYYY-MM-DD)
  campaignIds?: string[];   // Optional array of campaign IDs to filter
  affiliateId?: string;     // Optional affiliate ID filter
}

export interface PerformanceSummaryResponse {
  data: {
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    conversionRate: number;     // Percentage (0-100)
    averageRevenue: number;
    clickThroughRate: number;   // Percentage (0-100)
    totalImpressions: number;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
  status: "success" | "error";
  message?: string;
}

// Time Series Data
export interface PerformanceTimeSeriesRequest {
  startDate: string;        // ISO date format (YYYY-MM-DD)
  endDate: string;          // ISO date format (YYYY-MM-DD)
  campaignIds?: string[];   // Optional array of campaign IDs to filter
  affiliateId?: string;     // Optional affiliate ID filter
  granularity?: "daily" | "hourly" | "weekly" | "monthly"; // Default: "daily"
}

export interface PerformanceTimeSeriesResponse {
  data: {
    date: string;           // ISO date format (YYYY-MM-DD)
    clicks: number;
    impressions: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    clickThroughRate: number;
  }[];
  status: "success" | "error";
  message?: string;
}

// Daily Report
export interface DailyReportRequest {
  startDate: string;        // ISO date format (YYYY-MM-DD)
  endDate: string;          // ISO date format (YYYY-MM-DD)
  campaignIds?: string[];   // Optional array of campaign IDs to filter
  affiliateId?: string;     // Optional affiliate ID filter
  search?: string;          // Search term for campaign names
  page?: number;            // Page number (default: 1)
  limit?: number;           // Items per page (default: 10, max: 100)
  sortBy?: "date" | "clicks" | "conversions" | "revenue";
  sortOrder?: "asc" | "desc"; // Default: "desc"
}

export interface DailyReportResponse {
  data: {
    date: string;           // ISO date format (YYYY-MM-DD)
    campaignId: string;
    campaignName: string;
    clicks: number;
    impressions: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    clickThroughRate: number;
    payouts: number;
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  status: "success" | "error";
  message?: string;
}

// Conversions Report
export interface ConversionsReportRequest {
  startDate: string;        // ISO date format (YYYY-MM-DD)
  endDate: string;          // ISO date format (YYYY-MM-DD)
  campaignIds?: string[];   // Optional array of campaign IDs to filter
  affiliateId?: string;     // Optional affiliate ID filter
  search?: string;          // Search term for campaign names or transaction IDs
  page?: number;            // Page number (default: 1)
  limit?: number;           // Items per page (default: 10, max: 100)
  status?: "pending" | "approved" | "rejected" | "all"; // Default: "all"
  sortBy?: "timestamp" | "payout" | "campaign" | "status";
  sortOrder?: "asc" | "desc"; // Default: "desc"
}

export interface ConversionsReportResponse {
  data: {
    id: string;
    timestamp: string;      // ISO datetime format
    transactionId: string;
    campaignId: string;
    campaignName: string;
    offerId: string;
    offerName: string;
    status: "pending" | "approved" | "rejected";
    payout: number;
    currency: string;
    affiliateId: string;
    affiliateName: string;
    clickId?: string;
    conversionValue?: number;
    sub1?: string;
    sub2?: string;
    sub3?: string;
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  status: "success" | "error";
  message?: string;
}

// Clicks Report
export interface ClicksReportRequest {
  startDate: string;        // ISO date format (YYYY-MM-DD)
  endDate: string;          // ISO date format (YYYY-MM-DD)
  campaignIds?: string[];   // Optional array of campaign IDs to filter
  affiliateId?: string;     // Optional affiliate ID filter
  search?: string;          // Search term for campaign names or click IDs
  page?: number;            // Page number (default: 1)
  limit?: number;           // Items per page (default: 10, max: 100)
  sortBy?: "timestamp" | "campaign" | "affiliate";
  sortOrder?: "asc" | "desc"; // Default: "desc"
}

export interface ClicksReportResponse {
  data: {
    id: string;
    timestamp: string;      // ISO datetime format
    campaignId: string;
    campaignName: string;
    offerId: string;
    offerName: string;
    affiliateId: string;
    affiliateName: string;
    ipAddress: string;
    userAgent: string;
    country: string;
    region?: string;
    city?: string;
    referrerUrl?: string;
    landingPageUrl: string;
    sub1?: string;
    sub2?: string;
    sub3?: string;
    converted: boolean;
    conversionId?: string;
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  status: "success" | "error";
  message?: string;
}

// Helper function to make API requests
const makeApiRequest = async <T>(endpoint: string, params: Record<string, any> = {}): Promise<T> => {
  const url = new URL(`${config.basePath}${endpoint}`);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v.toString()));
      } else {
        url.searchParams.append(key, value.toString());
      }
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: config.headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Service functions
export const fetchPerformanceSummary = async (params: PerformanceSummaryRequest): Promise<PerformanceSummaryResponse> => {
  return makeApiRequest<PerformanceSummaryResponse>('/api/v1/reports/performance/summary', params);
};

export const fetchPerformanceTimeSeries = async (params: PerformanceTimeSeriesRequest): Promise<PerformanceTimeSeriesResponse> => {
  return makeApiRequest<PerformanceTimeSeriesResponse>('/api/v1/reports/performance/timeseries', params);
};

export const fetchDailyReport = async (params: DailyReportRequest): Promise<DailyReportResponse> => {
  return makeApiRequest<DailyReportResponse>('/api/v1/reports/performance/daily', params);
};

export const fetchConversionsReport = async (params: ConversionsReportRequest): Promise<ConversionsReportResponse> => {
  return makeApiRequest<ConversionsReportResponse>('/api/v1/reports/conversions', params);
};

export const fetchClicksReport = async (params: ClicksReportRequest): Promise<ClicksReportResponse> => {
  return makeApiRequest<ClicksReportResponse>('/api/v1/reports/clicks', params);
};

// Mock data for development - remove when real API is available
export const mockPerformanceSummary: PerformanceSummaryResponse = {
  data: {
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    conversionRate: 0,
    averageRevenue: 0,
    clickThroughRate: 0,
    totalImpressions: 0,
  },
  dateRange: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  },
  status: "success",
};

export const mockDailyReport: DailyReportResponse = {
  data: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  status: "success",
};