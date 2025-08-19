import { DashboardApi, DashboardGetRequest } from '@/generated-api/src/apis/DashboardApi';
import { DomainDashboardData } from '@/generated-api/src/models/DomainDashboardData';
import { createApiClient } from '@/services/backendApi';

export interface DashboardParams {
  period?: 'today' | '7d' | '30d' | '90d' | 'custom';
  startDate?: string; // ISO 8601 format (YYYY-MM-DD)
  endDate?: string;   // ISO 8601 format (YYYY-MM-DD)
  timezone?: string;  // Timezone identifier
}

export const fetchDashboardData = async (params?: DashboardParams): Promise<DomainDashboardData> => {
  try {
    const dashboardApi = await createApiClient(DashboardApi);
    const requestParams: DashboardGetRequest = {
      period: params?.period,
      startDate: params?.startDate,
      endDate: params?.endDate,
      timezone: params?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const response = await dashboardApi.dashboardGet(requestParams);
    return response;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const fetchCampaignDetail = async (campaignId: number) => {
  try {
    const dashboardApi = await createApiClient(DashboardApi);
    const response = await dashboardApi.dashboardCampaignsCampaignIdGet({ campaignId });
    return response;
  } catch (error) {
    console.error('Error fetching campaign detail:', error);
    throw error;
  }
};

export const fetchRecentActivity = async (params?: {
  limit?: number;
  offset?: number;
  type?: string[];
  since?: string;
}) => {
  try {
    const dashboardApi = await createApiClient(DashboardApi);
    const response = await dashboardApi.dashboardActivityGet(params || {});
    return response;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

export const trackActivity = async (activityData: {
  type: string;
  description: string;
  metadata?: Record<string, any>;
}) => {
  try {
    const dashboardApi = await createApiClient(DashboardApi);
    const response = await dashboardApi.dashboardActivityPost({
      request: activityData
    });
    return response;
  } catch (error) {
    console.error('Error tracking activity:', error);
    throw error;
  }
};

export const invalidateDashboardCache = async () => {
  try {
    const dashboardApi = await createApiClient(DashboardApi);
    const response = await dashboardApi.dashboardCacheInvalidatePost();
    return response;
  } catch (error) {
    console.error('Error invalidating dashboard cache:', error);
    throw error;
  }
};