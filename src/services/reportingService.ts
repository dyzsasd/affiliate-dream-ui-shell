import { ReportsApi } from '@/generated-api/src/apis/ReportsApi';
import { 
  HandlersPerformanceSummaryResponse,
  HandlersPerformanceTimeSeriesResponse,
  HandlersDailyPerformanceReportResponse,
  HandlersConversionsReportResponse,
  HandlersClicksReportResponse
} from '@/generated-api/src/models';
import { createApiClient } from '@/services/backendApi';

// Legacy interface compatibility - kept for existing code compatibility
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

export interface PerformanceTimeSeriesRequest {
  startDate: string;        
  endDate: string;          
  campaignIds?: string[];   
  affiliateId?: string;     
  granularity?: "daily" | "hourly" | "weekly" | "monthly";
}

export interface PerformanceTimeSeriesResponse {
  data: {
    date: string;           
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

export interface DailyReportRequest {
  startDate: string;        
  endDate: string;          
  campaignIds?: string[];   
  affiliateId?: string;     
  search?: string;          
  page?: number;            
  limit?: number;           
  sortBy?: "date" | "clicks" | "conversions" | "revenue";
  sortOrder?: "asc" | "desc";
}

export interface DailyReportResponse {
  data: {
    date: string;           
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

export interface ConversionsReportRequest {
  startDate: string;        
  endDate: string;          
  campaignIds?: string[];   
  affiliateId?: string;     
  search?: string;          
  page?: number;            
  limit?: number;           
  status?: "pending" | "approved" | "rejected" | "all";
  sortBy?: "timestamp" | "payout" | "campaign" | "status";
  sortOrder?: "asc" | "desc";
}

export interface ConversionsReportResponse {
  data: {
    id: string;
    timestamp: string;      
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

export interface ClicksReportRequest {
  startDate: string;        
  endDate: string;          
  campaignIds?: string[];   
  affiliateId?: string;     
  search?: string;          
  page?: number;            
  limit?: number;           
  sortBy?: "timestamp" | "campaign" | "affiliate";
  sortOrder?: "asc" | "desc";
}

export interface ClicksReportResponse {
  data: {
    id: string;
    timestamp: string;      
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

// Helper functions to transform API responses to legacy format
const transformSummaryResponse = (response: HandlersPerformanceSummaryResponse): PerformanceSummaryResponse => {
  return {
    data: {
      totalClicks: response.data?.totalClicks || 0,
      totalConversions: response.data?.totalConversions || 0,
      totalRevenue: response.data?.totalRevenue || 0,
      conversionRate: response.data?.conversionRate || 0,
      averageRevenue: response.data?.averageRevenue || 0,
      clickThroughRate: response.data?.clickThroughRate || 0,
      totalImpressions: response.data?.totalImpressions || 0,
    },
    dateRange: {
      startDate: response.dateRange?.startDate || '',
      endDate: response.dateRange?.endDate || '',
    },
    status: response.status === "success" ? "success" : "error",
    message: undefined,
  };
};

const transformTimeSeriesResponse = (response: HandlersPerformanceTimeSeriesResponse): PerformanceTimeSeriesResponse => {
  return {
    data: response.data?.map(item => ({
      date: item.date || '',
      clicks: item.clicks || 0,
      impressions: item.impressions || 0,
      conversions: item.conversions || 0,
      revenue: item.revenue || 0,
      conversionRate: item.conversionRate || 0,
      clickThroughRate: item.clickThroughRate || 0,
    })) || [],
    status: response.status === "success" ? "success" : "error",
    message: undefined,
  };
};

const transformDailyReportResponse = (response: HandlersDailyPerformanceReportResponse): DailyReportResponse => {
  return {
    data: response.data?.map(item => ({
      date: item.date || '',
      campaignId: item.campaignId || '',
      campaignName: item.campaignName || '',
      clicks: item.clicks || 0,
      impressions: item.impressions || 0,
      conversions: item.conversions || 0,
      revenue: item.revenue || 0,
      conversionRate: item.conversionRate || 0,
      clickThroughRate: item.clickThroughRate || 0,
      payouts: item.payouts || 0,
    })) || [],
    pagination: {
      currentPage: response.pagination?.currentPage || 1,
      totalPages: response.pagination?.totalPages || 1,
      totalItems: response.pagination?.totalItems || 0,
      itemsPerPage: response.pagination?.itemsPerPage || 10,
      hasNextPage: response.pagination?.hasNextPage || false,
      hasPreviousPage: response.pagination?.hasPreviousPage || false,
    },
    status: response.status === "success" ? "success" : "error",
    message: undefined,
  };
};

// Service functions using generated API
export const fetchPerformanceSummary = async (params: PerformanceSummaryRequest): Promise<PerformanceSummaryResponse> => {
  const reportsApi = await createApiClient(ReportsApi);
  const campaignIds = params.campaignIds?.join(',');
  const response = await reportsApi.reportsPerformanceSummaryGet({
    startDate: params.startDate,
    endDate: params.endDate,
    campaignIds,
    affiliateId: params.affiliateId,
  });
  return transformSummaryResponse(response);
};

export const fetchPerformanceTimeSeries = async (params: PerformanceTimeSeriesRequest): Promise<PerformanceTimeSeriesResponse> => {
  const reportsApi = await createApiClient(ReportsApi);
  const campaignIds = params.campaignIds?.join(',');
  const response = await reportsApi.reportsPerformanceTimeseriesGet({
    startDate: params.startDate,
    endDate: params.endDate,
    campaignIds,
    affiliateId: params.affiliateId,
    granularity: params.granularity,
  });
  return transformTimeSeriesResponse(response);
};

export const fetchDailyReport = async (params: DailyReportRequest): Promise<DailyReportResponse> => {
  const reportsApi = await createApiClient(ReportsApi);
  const campaignIds = params.campaignIds?.join(',');
  const response = await reportsApi.reportsPerformanceDailyGet({
    startDate: params.startDate,
    endDate: params.endDate,
    campaignIds,
    affiliateId: params.affiliateId,
    page: params.page,
    limit: params.limit,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });
  return transformDailyReportResponse(response);
};

export const fetchConversionsReport = async (params: ConversionsReportRequest): Promise<ConversionsReportResponse> => {
  const reportsApi = await createApiClient(ReportsApi);
  const campaignIds = params.campaignIds?.join(',');
  const response = await reportsApi.reportsConversionsGet({
    startDate: params.startDate,
    endDate: params.endDate,
    campaignIds,
    affiliateId: params.affiliateId,
    status: params.status,
    page: params.page,
    limit: params.limit,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  return {
    data: response.data?.map(item => ({
      id: item.id || '',
      timestamp: item.timestamp || '',
      transactionId: item.transactionId || '',
      campaignId: item.campaignId || '',
      campaignName: item.campaignName || '',
      offerId: item.offerId || '',
      offerName: item.offerName || '',
      status: (item.status as "pending" | "approved" | "rejected") || "pending",
      payout: item.payout || 0,
      currency: item.currency || 'USD',
      affiliateId: item.affiliateId || '',
      affiliateName: item.affiliateName || '',
      clickId: item.clickId,
      conversionValue: item.conversionValue,
      sub1: item.sub1,
      sub2: item.sub2,
      sub3: item.sub3,
    })) || [],
    pagination: {
      currentPage: response.pagination?.currentPage || 1,
      totalPages: response.pagination?.totalPages || 1,
      totalItems: response.pagination?.totalItems || 0,
      itemsPerPage: response.pagination?.itemsPerPage || 10,
      hasNextPage: response.pagination?.hasNextPage || false,
      hasPreviousPage: response.pagination?.hasPreviousPage || false,
    },
    status: response.status === "success" ? "success" : "error",
    message: undefined,
  };
};

export const fetchClicksReport = async (params: ClicksReportRequest): Promise<ClicksReportResponse> => {
  const reportsApi = await createApiClient(ReportsApi);
  const campaignIds = params.campaignIds?.join(',');
  const response = await reportsApi.reportsClicksGet({
    startDate: params.startDate,
    endDate: params.endDate,
    campaignIds,
    affiliateId: params.affiliateId,
    page: params.page,
    limit: params.limit,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  return {
    data: response.data?.map(item => ({
      id: item.id || '',
      timestamp: item.timestamp || '',
      campaignId: item.campaignId || '',
      campaignName: item.campaignName || '',
      offerId: item.offerId || '',
      offerName: item.offerName || '',
      affiliateId: item.affiliateId || '',
      affiliateName: item.affiliateName || '',
      ipAddress: item.ipAddress || '',
      userAgent: item.userAgent || '',
      country: item.country || '',
      region: item.region,
      city: item.city,
      referrerUrl: item.referrerUrl,
      landingPageUrl: item.landingPageUrl || '',
      sub1: item.sub1,
      sub2: item.sub2,
      sub3: item.sub3,
      converted: item.converted || false,
      conversionId: item.conversionId,
    })) || [],
    pagination: {
      currentPage: response.pagination?.currentPage || 1,
      totalPages: response.pagination?.totalPages || 1,
      totalItems: response.pagination?.totalItems || 0,
      itemsPerPage: response.pagination?.itemsPerPage || 10,
      hasNextPage: response.pagination?.hasNextPage || false,
      hasPreviousPage: response.pagination?.hasPreviousPage || false,
    },
    status: response.status === "success" ? "success" : "error",
    message: undefined,
  };
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