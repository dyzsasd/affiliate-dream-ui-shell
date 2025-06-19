
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

// Centralized mock data - updated with Adidas domains
const getMockAdvertisers = (organizationId: number): DomainAdvertiser[] => [
  {
    advertiserId: 1,
    name: "Adidas FR",
    contactEmail: "partnerships@adidas.fr",
    status: "active",
    organizationId: organizationId,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    advertiserId: 2,
    name: "Adidas ES",
    contactEmail: "marketing@adidas.es",
    status: "active",
    organizationId: organizationId,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    advertiserId: 3,
    name: "Nike Europe",
    contactEmail: "affiliate@nike.com",
    status: "pending",
    organizationId: organizationId,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    advertiserId: 4,
    name: "Puma Global",
    contactEmail: "partnerships@puma.com",
    status: "active",
    organizationId: organizationId,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    advertiserId: 5,
    name: "Under Armour EMEA",
    contactEmail: "business@underarmour.com",
    status: "inactive",
    organizationId: organizationId,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    advertiserId: 6,
    name: "Reebok International",
    contactEmail: "affiliates@reebok.com",
    status: "active",
    organizationId: organizationId,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

/**
 * Fetches advertisers for a specific organization
 * NOTE: This is currently mocked since the backend doesn't have advertiser endpoints yet
 */
export const fetchAdvertisers = async (organizationId: number): Promise<DomainAdvertiser[]> => {
  try {
    console.log(`Fetching advertisers for organization ID: ${organizationId}`);
    
    const mockAdvertisers = getMockAdvertisers(organizationId);
    
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
    
    // Get all mock advertisers from all organizations to ensure we can find any advertiser
    const allMockAdvertisers = [
      ...getMockAdvertisers(1),
      ...getMockAdvertisers(2),
      ...getMockAdvertisers(3),
      ...getMockAdvertisers(4),
      ...getMockAdvertisers(5)
    ];
    
    const advertiser = allMockAdvertisers.find(adv => adv.advertiserId === advertiserId);
    
    if (!advertiser) {
      throw new Error(`Advertiser with ID ${advertiserId} not found`);
    }
    
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
