
import { createApiClient } from '@/services/backendApi';
import { AffiliatesApi } from '@/generated-api/src/apis/AffiliatesApi';
import { DomainAffiliate } from '@/generated-api/src/models';
import { handleApiError } from './backendApi';
import { HandlersCreateAffiliateRequest, HandlersUpdateAffiliateRequest } from '@/generated-api/src/models';

/**
 * Fetches advertisers (affiliates) for a specific organization
 */
export const fetchAdvertisers = async (organizationId: number): Promise<DomainAffiliate[]> => {
  try {
    console.log(`Fetching affiliates for organization ID: ${organizationId}`);
    
    const affiliatesApi = await createApiClient(AffiliatesApi);
    
    console.log("Making API request to fetch affiliates");
    const affiliates = await affiliatesApi.organizationsIdAffiliatesGet({
      id: organizationId,
      page: 1,
      pageSize: 100
    });
    
    console.log(`Retrieved ${Array.isArray(affiliates) ? affiliates.length : 0} affiliates:`, affiliates);
    
    return Array.isArray(affiliates) ? affiliates : [];
  } catch (error) {
    console.error('Error fetching affiliates:', error);
    throw handleApiError(error);
  }
};

/**
 * Fetches a specific advertiser (affiliate) by ID
 */
export const fetchAdvertiser = async (advertiserId: number): Promise<DomainAffiliate> => {
  try {
    const affiliatesApi = await createApiClient(AffiliatesApi);
    return await affiliatesApi.affiliatesIdGet({ id: advertiserId });
  } catch (error) {
    console.error(`Error fetching affiliate ${advertiserId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Creates a new advertiser (affiliate)
 */
export const createAdvertiser = async (
  organizationId: number, 
  data: Omit<HandlersCreateAffiliateRequest, 'organizationId'>
): Promise<DomainAffiliate> => {
  try {
    const affiliatesApi = await createApiClient(AffiliatesApi);
    
    const createRequest: HandlersCreateAffiliateRequest = {
      ...data,
      organizationId
    };
    
    return await affiliatesApi.affiliatesPost({ request: createRequest });
  } catch (error) {
    console.error('Error creating affiliate:', error);
    throw handleApiError(error);
  }
};

/**
 * Updates an existing advertiser (affiliate)
 */
export const updateAdvertiser = async (
  advertiserId: number, 
  data: Partial<HandlersUpdateAffiliateRequest>
): Promise<DomainAffiliate> => {
  try {
    const affiliatesApi = await createApiClient(AffiliatesApi);
    
    return await affiliatesApi.affiliatesIdPut({
      id: advertiserId,
      request: data as HandlersUpdateAffiliateRequest
    });
  } catch (error) {
    console.error(`Error updating affiliate ${advertiserId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Deletes an advertiser (affiliate)
 */
export const deleteAdvertiser = async (advertiserId: number): Promise<void> => {
  try {
    const affiliatesApi = await createApiClient(AffiliatesApi);
    await affiliatesApi.affiliatesIdDelete({ id: advertiserId });
  } catch (error) {
    console.error(`Error deleting affiliate ${advertiserId}:`, error);
    throw handleApiError(error);
  }
};
