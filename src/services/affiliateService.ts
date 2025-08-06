import { createApiClient } from '@/services/backendApi';
import { AffiliatesApi } from '@/generated-api/src/apis/AffiliatesApi';
import { DomainAffiliate } from '@/generated-api/src/models';
import { handleApiError } from './backendApi';

/**
 * Fetches affiliates for a specific organization using real API
 */
export const fetchAffiliates = async (organizationId: number): Promise<DomainAffiliate[]> => {
  try {
    console.log(`Fetching affiliates for organization ID: ${organizationId}`);
    
    const affiliatesApi = await createApiClient(AffiliatesApi);
    const affiliates = await affiliatesApi.organizationsIdAffiliatesGet({
      id: organizationId,
      page: 1,
      pageSize: 100
    });
    
    console.log(`Retrieved ${affiliates.length} affiliates from API:`, affiliates);
    return affiliates;
  } catch (error) {
    console.error('Error fetching affiliates:', error);
    throw handleApiError(error);
  }
};

/**
 * Fetches a specific affiliate by ID using real API
 */
export const fetchAffiliate = async (affiliateId: number): Promise<DomainAffiliate> => {
  try {
    console.log(`Fetching affiliate ID: ${affiliateId}`);
    
    const affiliatesApi = await createApiClient(AffiliatesApi);
    const affiliate = await affiliatesApi.affiliatesIdGet({
      id: affiliateId
    });
    
    console.log(`Retrieved affiliate data:`, affiliate);
    return affiliate;
  } catch (error) {
    console.error(`Error fetching affiliate ${affiliateId}:`, error);
    throw handleApiError(error);
  }
};