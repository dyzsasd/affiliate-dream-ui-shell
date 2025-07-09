import { AffiliatesApi } from '@/generated-api/src/apis/AffiliatesApi';
import type { 
  DomainAnalyticsPublisherResponse,
  HandlersAffiliatesSearchRequest 
} from '@/generated-api/src/models';
import { createApiClient, handleApiError } from './backendApi';

export interface PublisherSearchParams {
  country?: string;
  verticals?: string[];
  partnerDomains?: string[];
  page?: number;
  pageSize?: number;
}

export interface PublisherSearchResult {
  publishers: DomainAnalyticsPublisherResponse[];
  hasMore: boolean;
  totalCount: number;
}

export const searchPublishers = async (params: PublisherSearchParams): Promise<PublisherSearchResult> => {
  try {
    const apiClient = await createApiClient(AffiliatesApi);
    
    const searchRequest: HandlersAffiliatesSearchRequest = {
      country: params.country,
      verticals: params.verticals,
      partnerDomains: params.partnerDomains,
      page: params.page,
      offset: params.pageSize
    };

    const response = await apiClient.affiliatesSearchPost({
      request: searchRequest,
      page: params.page || 1,
      pageSize: params.pageSize || 20
    });

    return {
      publishers: response,
      hasMore: response.length === (params.pageSize || 20),
      totalCount: response.length > 0 ? 100 : 0 // Mock total count as API doesn't return it
    };
  } catch (error) {
    console.error('Error searching publishers:', error);
    const apiError = handleApiError(error);
    throw new Error(`Failed to search publishers: ${apiError.message}`);
  }
};

export const getCountriesFromPublishers = (publishers: DomainAnalyticsPublisherResponse[]): string[] => {
  const countries = new Set<string>();
  
  publishers.forEach(response => {
    const countryRankings = response.publisher?.countryRankings;
    if (countryRankings?.value) {
      countryRankings.value.forEach((ranking: any) => {
        if (ranking.countryCode) {
          countries.add(ranking.countryCode.toUpperCase());
        }
      });
    }
  });
  
  return Array.from(countries).sort();
};

export const getVerticalsFromPublishers = (publishers: DomainAnalyticsPublisherResponse[]): string[] => {
  const verticals = new Set<string>();
  
  publishers.forEach(response => {
    const verticalsV2 = response.publisher?.verticalsV2;
    if (verticalsV2?.value) {
      verticalsV2.value.forEach((vertical: any) => {
        if (vertical.name) {
          verticals.add(vertical.name);
        }
      });
    }
  });
  
  return Array.from(verticals).sort();
};