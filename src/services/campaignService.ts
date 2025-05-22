
import { 
  CampaignsApi
} from '@/generated-api/src/apis';
import { 
  DomainCampaign, 
  DomainCampaignProviderOffer,
  HandlersCreateCampaignRequest,
  HandlersUpdateCampaignRequest
} from '@/generated-api/src/models';
import { createApiClient, handleApiError } from './backendApi';
import { Campaign, CampaignDetail, Offer } from '@/types/api';

// Map backend campaign model to frontend Campaign type
const mapToCampaign = (domainCampaign: DomainCampaign): Campaign => {
  return {
    id: String(domainCampaign.campaignId || ''),
    name: domainCampaign.name || '',
    description: domainCampaign.description || '',
    status: (domainCampaign.status as 'active' | 'paused' | 'draft') || 'draft',
    startDate: domainCampaign.startDate,
    endDate: domainCampaign.endDate,
    createdAt: domainCampaign.createdAt || new Date().toISOString(),
    updatedAt: domainCampaign.updatedAt || new Date().toISOString(),
  };
};

// Map backend offer model to frontend Offer type
const mapToOffer = (domainOffer: DomainCampaignProviderOffer): Offer => {
  // Extract data from the provider config if available
  let providerConfig: any = {};
  if (domainOffer.providerOfferConfig) {
    try {
      providerConfig = JSON.parse(domainOffer.providerOfferConfig);
    } catch (e) {
      console.error('Error parsing provider offer config:', e);
    }
  }

  return {
    id: String(domainOffer.providerOfferId || ''),
    name: providerConfig?.name || 'Unnamed Offer',
    payoutType: (providerConfig?.payout_type as 'CPA' | 'RevShare' | 'Hybrid') || 'CPA',
    payoutAmount: providerConfig?.payout_amount || 0,
    description: providerConfig?.description || '',
  };
};

export const campaignService = {
  // Get all campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      const campaignsApi = await createApiClient(CampaignsApi);
      
      // Using organization ID 1 as default for now - this should be dynamic in a real app
      const response = await campaignsApi.organizationsIdCampaignsGet({ id: 1 });
      
      if (Array.isArray(response)) {
        return response.map(mapToCampaign);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw handleApiError(error);
    }
  },
  
  // Get a single campaign with details
  getCampaign: async (id: string): Promise<CampaignDetail | null> => {
    try {
      const campaignsApi = await createApiClient(CampaignsApi);
      const campaign = await campaignsApi.campaignsIdGet({ id: Number(id) });
      
      if (!campaign) {
        return null;
      }
      
      // Fetch offers for this campaign
      const offers = await campaignsApi.campaignsIdProviderOffersGet({ id: Number(id) });
      
      const mappedCampaign = mapToCampaign(campaign);
      const mappedOffers = Array.isArray(offers) ? offers.map(mapToOffer) : [];
      
      return {
        ...mappedCampaign,
        offers: mappedOffers
      };
    } catch (error) {
      console.error(`Error fetching campaign with id ${id}:`, error);
      throw handleApiError(error);
    }
  },
  
  // Create a new campaign
  createCampaign: async (campaignData: Partial<Campaign>): Promise<Campaign> => {
    try {
      const campaignsApi = await createApiClient(CampaignsApi);
      
      // Create a valid request object
      const request: HandlersCreateCampaignRequest = {
        name: campaignData.name || '',
        description: campaignData.description || '',
        status: campaignData.status || 'draft',
        // Using default values for organization and advertiser IDs
        // These should come from context in a real app
        organizationId: 1,
        advertiserId: 1,
        startDate: campaignData.startDate,
        endDate: campaignData.endDate
      };
      
      const response = await campaignsApi.campaignsPost({ request });
      
      return mapToCampaign(response);
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw handleApiError(error);
    }
  },
  
  // Update an existing campaign
  updateCampaign: async (id: string, campaignData: Partial<Campaign>): Promise<Campaign> => {
    try {
      const campaignsApi = await createApiClient(CampaignsApi);
      
      // Create a valid request object
      const request: HandlersUpdateCampaignRequest = {
        name: campaignData.name,
        description: campaignData.description,
        status: campaignData.status,
        startDate: campaignData.startDate,
        endDate: campaignData.endDate
      };
      
      const response = await campaignsApi.campaignsIdPut({
        id: Number(id),
        request
      });
      
      return mapToCampaign(response);
    } catch (error) {
      console.error(`Error updating campaign with id ${id}:`, error);
      throw handleApiError(error);
    }
  },
  
  // Delete a campaign
  deleteCampaign: async (id: string): Promise<void> => {
    try {
      const campaignsApi = await createApiClient(CampaignsApi);
      await campaignsApi.campaignsIdDelete({ id: Number(id) });
    } catch (error) {
      console.error(`Error deleting campaign with id ${id}:`, error);
      throw handleApiError(error);
    }
  }
};
