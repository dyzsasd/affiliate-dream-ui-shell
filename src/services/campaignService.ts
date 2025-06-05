
import { 
  CampaignsApi
} from '@/generated-api/src/apis';
import { 
  ModelsCampaignResponse, 
  ModelsCreateCampaignRequest,
  ModelsUpdateCampaignRequest
} from '@/generated-api/src/models';
import { createApiClient, handleApiError } from './backendApi';
import { Campaign, CampaignDetail, Offer } from '@/types/api';

// Map backend campaign model to frontend Campaign type
const mapToCampaign = (domainCampaign: ModelsCampaignResponse): Campaign => {
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

// Map backend offer model to frontend Offer type - using placeholder since no offer model exists
const mapToOffer = (domainOffer: any): Offer => {
  return {
    id: String(domainOffer.id || ''),
    name: domainOffer.name || 'Unnamed Offer',
    payoutType: 'CPA',
    payoutAmount: domainOffer.payoutAmount || 0,
    description: domainOffer.description || '',
  };
};

export const campaignService = {
  // Get all campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      const campaignsApi = await createApiClient(CampaignsApi);
      
      // Using organization ID 1 as default for now - this should be dynamic in a real app
      const response = await campaignsApi.organizationsOrganizationIdCampaignsGet({ organizationId: 1 });
      
      if (response && response.campaigns && Array.isArray(response.campaigns)) {
        return response.campaigns.map(mapToCampaign);
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
      
      const mappedCampaign = mapToCampaign(campaign);
      
      return {
        ...mappedCampaign,
        offers: [] // No offers endpoint available in current API
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
      const request: ModelsCreateCampaignRequest = {
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
      
      const response = await campaignsApi.campaignsPost({ campaign: request });
      
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
      const request: ModelsUpdateCampaignRequest = {
        name: campaignData.name || '',
        description: campaignData.description,
        status: campaignData.status || 'draft',
        startDate: campaignData.startDate,
        endDate: campaignData.endDate
      };
      
      const response = await campaignsApi.campaignsIdPut({
        id: Number(id),
        campaign: request
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
