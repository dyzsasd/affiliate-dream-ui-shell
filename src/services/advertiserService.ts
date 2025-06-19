
import { createApiClient } from '@/services/backendApi';
import { AdvertisersApi } from '@/generated-api/src/apis/AdvertisersApi';
import { DomainAdvertiser, ModelsAdvertiserResponse } from '@/generated-api/src/models';
import { handleApiError } from './backendApi';

// Request interfaces for creating and updating advertisers
interface MockCreateAdvertiserRequest {
  name: string;
  contactEmail?: string;
  status?: string;
}

interface MockUpdateAdvertiserRequest {
  name?: string;
  contactEmail?: string;
  status?: string;
}

/**
 * Fetches advertisers for a specific organization using real API
 */
export const fetchAdvertisers = async (organizationId: number): Promise<DomainAdvertiser[]> => {
  try {
    console.log(`Fetching advertisers for organization ID: ${organizationId}`);
    
    const advertisersApi = await createApiClient(AdvertisersApi);
    const advertisers = await advertisersApi.organizationsIdAdvertisersGet({
      id: organizationId,
      page: 1,
      pageSize: 100
    });
    
    console.log(`Retrieved ${advertisers.length} advertisers from API:`, advertisers);
    return advertisers;
  } catch (error) {
    console.error('Error fetching advertisers:', error);
    throw handleApiError(error);
  }
};

/**
 * Fetches a specific advertiser by ID using real API
 */
export const fetchAdvertiser = async (advertiserId: number): Promise<DomainAdvertiser> => {
  try {
    console.log(`Fetching advertiser ID: ${advertiserId}`);
    
    const advertisersApi = await createApiClient(AdvertisersApi);
    const response: ModelsAdvertiserResponse = await advertisersApi.advertisersIdGet({
      id: advertiserId
    });
    
    // Convert ModelsAdvertiserResponse to DomainAdvertiser format
    const advertiser: DomainAdvertiser = {
      advertiserId: response.advertiserId,
      name: response.name,
      contactEmail: response.contactEmail,
      status: response.status,
      organizationId: response.organizationId,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      billingDetails: response.billingDetails,
      accountingContactEmail: response.accountingContactEmail,
      affiliateIdMacro: response.affiliateIdMacro,
      attributionMethod: response.attributionMethod,
      attributionPriority: response.attributionPriority,
      defaultCurrencyId: response.defaultCurrencyId,
      emailAttributionMethod: response.emailAttributionMethod,
      internalNotes: response.internalNotes,
      offerIdMacro: response.offerIdMacro,
      platformName: response.platformName,
      platformUrl: response.platformUrl,
      platformUsername: response.platformUsername,
      reportingTimezoneId: response.reportingTimezoneId
    };
    
    console.log(`Found advertiser:`, advertiser);
    return advertiser;
  } catch (error) {
    console.error(`Error fetching advertiser ${advertiserId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Creates a new advertiser
 * NOTE: This is currently mocked since the backend doesn't have advertiser endpoints yet
 */
export const createAdvertiser = async (
  organizationId: number, 
  data: MockCreateAdvertiserRequest
): Promise<DomainAdvertiser> => {
  try {
    console.log('Creating mock advertiser:', data);
    
    // Mock creation
    const mockAdvertiser: DomainAdvertiser = {
      advertiserId: Date.now(), // Simple ID generation for mock
      name: data.name,
      contactEmail: data.contactEmail,
      status: data.status || "pending",
      organizationId: organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return mockAdvertiser;
  } catch (error) {
    console.error('Error creating advertiser:', error);
    throw handleApiError(error);
  }
};

/**
 * Updates an existing advertiser
 * NOTE: This is currently mocked since the backend doesn't have advertiser endpoints yet
 */
export const updateAdvertiser = async (
  advertiserId: number, 
  data: MockUpdateAdvertiserRequest
): Promise<DomainAdvertiser> => {
  try {
    console.log(`Updating mock advertiser ${advertiserId}:`, data);
    
    // Mock update
    const mockAdvertiser: DomainAdvertiser = {
      advertiserId: advertiserId,
      name: data.name || "Updated Advertiser",
      contactEmail: data.contactEmail || "updated@example.com",
      status: data.status || "active",
      organizationId: 1,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      updatedAt: new Date().toISOString()
    };
    
    return mockAdvertiser;
  } catch (error) {
    console.error(`Error updating advertiser ${advertiserId}:`, error);
    throw handleApiError(error);
  }
};

/**
 * Deletes an advertiser
 * NOTE: This is currently mocked since the backend doesn't have advertiser endpoints yet
 */
export const deleteAdvertiser = async (advertiserId: number): Promise<void> => {
  try {
    console.log(`Deleting mock advertiser ${advertiserId}`);
    // Mock deletion - just log for now
    return Promise.resolve();
  } catch (error) {
    console.error(`Error deleting advertiser ${advertiserId}:`, error);
    throw handleApiError(error);
  }
};
