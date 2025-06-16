
import { createApiClient } from '@/services/backendApi';
import { OrganizationsApi } from '@/generated-api/src/apis/OrganizationsApi';
import { DomainAdvertiser } from '@/generated-api/src/models';
import { handleApiError } from './backendApi';
import { HandlersCreateAdvertiserRequest, HandlersUpdateAdvertiserRequest } from '@/generated-api/src/models';

/**
 * Fetches advertisers for a specific organization
 */
export const fetchAdvertisers = async (organizationId: number): Promise<DomainAdvertiser[]> => {
  try {
    console.log(`Fetching advertisers for organization ID: ${organizationId}`);
    
    const organizationsApi = await createApiClient(OrganizationsApi);
    
    console.log("Making API request to fetch advertisers");
    const advertisers = await organizationsApi.organizationsIdAdvertisersGet({
      id: organizationId,
      page: 1,
      pageSize: 100
    });
    
    console.log(`Retrieved ${Array.isArray(advertisers) ? advertisers.length : 0} advertisers:`, advertisers);
    
    if (Array.isArray(advertisers)) {
      return advertisers;
    }
    
    return [];
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
    const organizationsApi = await createApiClient(OrganizationsApi);
    const advertiser = await organizationsApi.advertisersIdGet({ id: advertiserId });
    return advertiser;
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
    const organizationsApi = await createApiClient(OrganizationsApi);
    
    const createRequest: HandlersCreateAdvertiserRequest = {
      ...data,
      organizationId
    };
    
    const advertiser = await organizationsApi.advertisersPost({ request: createRequest });
    return advertiser;
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
    const organizationsApi = await createApiClient(OrganizationsApi);
    
    const advertiser = await organizationsApi.advertisersIdPut({
      id: advertiserId,
      request: data as HandlersUpdateAdvertiserRequest
    });
    
    return advertiser;
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
    const organizationsApi = await createApiClient(OrganizationsApi);
    await organizationsApi.advertisersIdDelete({ id: advertiserId });
  } catch (error) {
    console.error(`Error deleting advertiser ${advertiserId}:`, error);
    throw handleApiError(error);
  }
};
