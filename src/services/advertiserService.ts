
import { AdvertisersApi, OrganizationsIdAdvertisersGetRequest } from '@/generated-api/src/apis/AdvertisersApi';
import { DomainAdvertiser, HandlersCreateAdvertiserRequest, HandlersUpdateAdvertiserRequest } from '@/generated-api/src/models';
import { createApiClient, getAuthTokens, handleApiError } from './backendApi';

/**
 * Fetches advertisers for an organization from the backend API
 */
export const fetchAdvertisers = async (organizationId: number): Promise<DomainAdvertiser[]> => {
  if (!organizationId) {
    console.log("Cannot fetch advertisers: No organization ID provided");
    return [];
  }
  
  try {
    // Get a fresh session with possibly refreshed token
    const session = await getAuthTokens();
    
    if (!session) {
      console.log("No valid session found for advertisers fetch");
      throw new Error("Authentication required");
    }
    
    console.log("Fetching advertisers for organization ID:", organizationId);
    const advertisersApi = await createApiClient(AdvertisersApi);
    
    const params: OrganizationsIdAdvertisersGetRequest = {
      id: organizationId,
      page: 1,
      pageSize: 100 // You may want to implement pagination in the future
    };
    
    const advertisers = await advertisersApi.organizationsIdAdvertisersGet(params);
    console.log("Advertisers fetched successfully, count:", advertisers.length);
    
    return advertisers;
  } catch (error) {
    console.error('Error fetching advertisers:', error);
    return [];
  }
};

/**
 * Fetches a single advertiser by ID
 */
export const fetchAdvertiser = async (advertiserId: number): Promise<DomainAdvertiser | null> => {
  if (!advertiserId) {
    console.log("Cannot fetch advertiser: No advertiser ID provided");
    return null;
  }
  
  try {
    const session = await getAuthTokens();
    
    if (!session) {
      console.log("No valid session found for advertiser fetch");
      throw new Error("Authentication required");
    }
    
    console.log("Fetching advertiser with ID:", advertiserId);
    const advertisersApi = await createApiClient(AdvertisersApi);
    
    const advertiser = await advertisersApi.advertisersIdGet({ id: advertiserId });
    console.log("Advertiser fetched successfully:", advertiser);
    
    return advertiser;
  } catch (error) {
    console.error('Error fetching advertiser:', error);
    return null;
  }
};

/**
 * Creates a new advertiser in the organization
 */
export const createAdvertiser = async (
  organizationId: number, 
  advertiserData: { 
    name: string; 
    contactEmail?: string;
    billingDetails?: object;
    status?: string;
  }
): Promise<DomainAdvertiser | null> => {
  try {
    const session = await getAuthTokens();
    
    if (!session) {
      console.log("No valid session found for advertiser creation");
      throw new Error("Authentication required");
    }
    
    console.log("Creating new advertiser for organization ID:", organizationId);
    const advertisersApi = await createApiClient(AdvertisersApi);
    
    const request: HandlersCreateAdvertiserRequest = {
      name: advertiserData.name,
      organizationId: organizationId,
      contactEmail: advertiserData.contactEmail,
      billingDetails: advertiserData.billingDetails,
      status: advertiserData.status || 'active'
    };
    
    const advertiser = await advertisersApi.advertisersPost({ request });
    console.log("Advertiser created successfully:", advertiser);
    
    return advertiser;
  } catch (error) {
    console.error('Error creating advertiser:', error);
    throw error;
  }
};

/**
 * Updates an existing advertiser
 */
export const updateAdvertiser = async (
  advertiserId: number,
  advertiserData: {
    name: string;
    contactEmail?: string;
    billingDetails?: object;
    status: string;
  }
): Promise<DomainAdvertiser | null> => {
  try {
    const session = await getAuthTokens();
    
    if (!session) {
      console.log("No valid session found for advertiser update");
      throw new Error("Authentication required");
    }
    
    console.log("Updating advertiser with ID:", advertiserId);
    const advertisersApi = await createApiClient(AdvertisersApi);
    
    const request: HandlersUpdateAdvertiserRequest = {
      name: advertiserData.name,
      status: advertiserData.status,
      contactEmail: advertiserData.contactEmail,
      billingDetails: advertiserData.billingDetails
    };
    
    const advertiser = await advertisersApi.advertisersIdPut({ 
      id: advertiserId, 
      request 
    });
    
    console.log("Advertiser updated successfully:", advertiser);
    return advertiser;
  } catch (error) {
    console.error('Error updating advertiser:', error);
    throw error;
  }
};

/**
 * Deletes an advertiser by its ID
 */
export const deleteAdvertiser = async (advertiserId: number): Promise<boolean> => {
  try {
    const session = await getAuthTokens();
    
    if (!session) {
      console.log("No valid session found for advertiser deletion");
      throw new Error("Authentication required");
    }
    
    console.log("Deleting advertiser with ID:", advertiserId);
    const advertisersApi = await createApiClient(AdvertisersApi);
    
    await advertisersApi.advertisersIdDelete({ id: advertiserId });
    console.log("Advertiser deleted successfully");
    
    return true;
  } catch (error) {
    console.error('Error deleting advertiser:', error);
    return false;
  }
};
