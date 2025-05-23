
import { createApiClient } from '@/services/backendApi';
import { AdvertisersApi } from '@/generated-api/src/apis/AdvertisersApi';
import { DomainAdvertiser } from '@/generated-api/src/models';
import { OrganizationsIdAdvertisersGetRequest } from '@/generated-api/src/apis/AdvertisersApi';
import { handleApiError } from './backendApi';

/**
 * Fetches advertisers for a specific organization
 */
export const fetchAdvertisers = async (organizationId: number): Promise<DomainAdvertiser[]> => {
  try {
    console.log(`Fetching advertisers for organization ID: ${organizationId}`);
    
    const advertisersApi = await createApiClient(AdvertisersApi);
    
    const params: OrganizationsIdAdvertisersGetRequest = {
      id: organizationId,
      page: 1,
      pageSize: 100 // You may want to implement pagination in the future
    };
    
    console.log("Making API request with params:", params);
    const advertisers = await advertisersApi.organizationsIdAdvertisersGet(params);
    console.log(`Retrieved ${advertisers.length} advertisers:`, advertisers);
    
    return advertisers;
  } catch (error) {
    console.error('Error fetching advertisers:', error);
    throw handleApiError(error);
  }
};

/**
 * Fetches a specific advertiser by ID
 */
export const fetchAdvertiser = async (advertiserId: number): Promise<DomainAdvertiser> => {
  try {
    const advertisersApi = await createApiClient(AdvertisersApi);
    return await advertisersApi.advertisersIdGet({ id: advertiserId });
  } catch (error) {
    console.error(`Error fetching advertiser ${advertiserId}:`, error);
    throw handleApiError(error);
  }
};
