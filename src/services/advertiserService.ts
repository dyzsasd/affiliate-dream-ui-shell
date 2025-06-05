
import { createApiClient } from '@/services/backendApi';
import { AffiliatesApi } from '@/generated-api/src/apis/AffiliatesApi';
import { DomainAffiliate, DomainAdvertiser } from '@/generated-api/src/models';
import { handleApiError } from './backendApi';
import { HandlersCreateAffiliateRequest, HandlersUpdateAffiliateRequest } from '@/generated-api/src/models';

// Map DomainAffiliate to DomainAdvertiser for frontend compatibility
const mapAffiliateToAdvertiser = (affiliate: DomainAffiliate): DomainAdvertiser => {
  return {
    advertiserId: affiliate.affiliateId,
    billingDetails: affiliate.billingInfo || affiliate.paymentDetails,
    contactEmail: affiliate.contactEmail,
    createdAt: affiliate.createdAt,
    name: affiliate.name,
    organizationId: affiliate.organizationId,
    status: affiliate.status,
    updatedAt: affiliate.updatedAt,
  };
};

/**
 * Fetches advertisers (affiliates) for a specific organization
 */
export const fetchAdvertisers = async (organizationId: number): Promise<DomainAdvertiser[]> => {
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
    
    if (Array.isArray(affiliates)) {
      return affiliates.map(mapAffiliateToAdvertiser);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching affiliates:', error);
    throw handleApiError(error);
  }
};

/**
 * Fetches a specific advertiser (affiliate) by ID
 */
export const fetchAdvertiser = async (advertiserId: number): Promise<DomainAdvertiser> => {
  try {
    const affiliatesApi = await createApiClient(AffiliatesApi);
    const affiliate = await affiliatesApi.affiliatesIdGet({ id: advertiserId });
    return mapAffiliateToAdvertiser(affiliate);
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
): Promise<DomainAdvertiser> => {
  try {
    const affiliatesApi = await createApiClient(AffiliatesApi);
    
    const createRequest: HandlersCreateAffiliateRequest = {
      ...data,
      organizationId,
      // Map billingDetails to paymentDetails for affiliate API
      paymentDetails: data.paymentDetails
    };
    
    const affiliate = await affiliatesApi.affiliatesPost({ request: createRequest });
    return mapAffiliateToAdvertiser(affiliate);
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
): Promise<DomainAdvertiser> => {
  try {
    const affiliatesApi = await createApiClient(AffiliatesApi);
    
    const affiliate = await affiliatesApi.affiliatesIdPut({
      id: advertiserId,
      request: data as HandlersUpdateAffiliateRequest
    });
    
    return mapAffiliateToAdvertiser(affiliate);
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
