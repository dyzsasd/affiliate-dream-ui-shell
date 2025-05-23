
import { createApiClient } from '@/services/backendApi';
import { AdvertisersApi } from '@/generated-api/src/apis/AdvertisersApi';
import { DomainAdvertiser } from '@/generated-api/src/models';
import { OrganizationsIdAdvertisersGetRequest } from '@/generated-api/src/apis/AdvertisersApi';
import { handleApiError } from './backendApi';
import { HandlersCreateAdvertiserRequest, HandlersUpdateAdvertiserRequest } from '@/generated-api/src/models';

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

/**
 * Creates a new advertiser
 */
export const createAdvertiser = async (
  organizationId: number, 
  data: Omit<HandlersCreateAdvertiserRequest, 'organizationId'>
): Promise<DomainAdvertiser> => {
  try {
    const advertisersApi = await createApiClient(AdvertisersApi);
    
    const createRequest: HandlersCreateAdvertiserRequest = {
      ...data,
      organizationId
    };
    
    return await advertisersApi.advertisersPost({ handlersCreateAdvertiserRequest: createRequest });
  } catch (error) {
    console.error('Error creating advertiser:', error);
    throw handleApiError(error);
  }
};

/**
 * Updates an existing advertiser
 */
export const updateAdvertiser = async (
  advertiserId: number, 
  data: Partial<HandlersUpdateAdvertiserRequest>
): Promise<DomainAdvertiser> => {
  try {
    const advertisersApi = await createApiClient(AdvertisersApi);
    
    return await advertisersApi.advertisersIdPut({
      id: advertiserId,
      handlersUpdateAdvertiserRequest: data as HandlersUpdateAdvertiserRequest
    });
  } catch (error) {
    console.error(`Error updating advertiser ${advertiserId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Deletes an advertiser
 */
export const deleteAdvertiser = async (advertiserId: number): Promise<void> => {
  try {
    const advertisersApi = await createApiClient(AdvertisersApi);
    await advertisersApi.advertisersIdDelete({ id: advertiserId });
  } catch (error) {
    console.error(`Error deleting advertiser ${advertiserId}:`, error);
    throw handleApiError(error);
  }
};
