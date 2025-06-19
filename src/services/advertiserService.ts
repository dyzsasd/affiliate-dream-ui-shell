
import { createApiClient } from '@/services/backendApi';
import { OrganizationsApi } from '@/generated-api/src/apis/OrganizationsApi';
import { DomainAdvertiser } from '@/generated-api/src/models';
import { handleApiError } from './backendApi';

// Mock advertiser data structure for now since backend doesn't have advertiser endpoints
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
 * Fetches advertisers for a specific organization
 * NOTE: This is currently mocked since the backend doesn't have advertiser endpoints yet
 */
export const fetchAdvertisers = async (organizationId: number): Promise<DomainAdvertiser[]> => {
  try {
    console.log(`Fetching advertisers for organization ID: ${organizationId}`);
    
    // Updated mock data with Adidas regional accounts
    const mockAdvertisers: DomainAdvertiser[] = [
      {
        advertiserId: 1,
        name: "Adidas FR",
        contactEmail: "partnerships@adidas.fr",
        status: "active",
        organizationId: organizationId,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        advertiserId: 2,
        name: "Adidas ES",
        contactEmail: "marketing@adidas.es",
        status: "active",
        organizationId: organizationId,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      },
      {
        advertiserId: 3,
        name: "Nike Europe",
        contactEmail: "affiliate@nike.com",
        status: "pending",
        organizationId: organizationId,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
      },
      {
        advertiserId: 4,
        name: "Puma Global",
        contactEmail: "partnerships@puma.com",
        status: "active",
        organizationId: organizationId,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      },
      {
        advertiserId: 5,
        name: "Under Armour EMEA",
        contactEmail: "business@underarmour.com",
        status: "inactive",
        organizationId: organizationId,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
      },
      {
        advertiserId: 6,
        name: "Reebok International",
        contactEmail: "affiliates@reebok.com",
        status: "active",
        organizationId: organizationId,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      }
    ];
    
    console.log(`Retrieved ${mockAdvertisers.length} mock advertisers:`, mockAdvertisers);
    return mockAdvertisers;
  } catch (error) {
    console.error('Error fetching advertisers:', error);
    throw handleApiError(error);
  }
};

/**
 * Fetches a specific advertiser by ID
 * NOTE: This is currently mocked since the backend doesn't have advertiser endpoints yet
 */
export const fetchAdvertiser = async (advertiserId: number): Promise<DomainAdvertiser> => {
  try {
    console.log(`Fetching advertiser ID: ${advertiserId}`);
    
    // Mock single advertiser
    const mockAdvertiser: DomainAdvertiser = {
      advertiserId: advertiserId,
      name: "Mock Advertiser",
      contactEmail: "mock@example.com",
      status: "active",
      organizationId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return mockAdvertiser;
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
