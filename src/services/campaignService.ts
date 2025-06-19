
import { 
  CampaignsApi
} from '@/generated-api/src/apis';
import { 
  ModelsCampaignResponse, 
  ModelsCreateCampaignRequest,
  ModelsUpdateCampaignRequest,
  ModelsCampaignListResponse
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

// Map backend campaign model to frontend CampaignDetail type
const mapToCampaignDetail = (domainCampaign: ModelsCampaignResponse): CampaignDetail => {
  return {
    id: String(domainCampaign.campaignId || ''),
    name: domainCampaign.name || '',
    description: domainCampaign.description || '',
    status: (domainCampaign.status as 'active' | 'paused' | 'draft') || 'draft',
    startDate: domainCampaign.startDate,
    endDate: domainCampaign.endDate,
    createdAt: domainCampaign.createdAt || new Date().toISOString(),
    updatedAt: domainCampaign.updatedAt || new Date().toISOString(),
    
    // Additional fields from ModelsCampaignResponse
    campaignId: domainCampaign.campaignId,
    advertiserId: domainCampaign.advertiserId,
    organizationId: domainCampaign.organizationId,
    destinationUrl: domainCampaign.destinationUrl,
    thumbnailUrl: domainCampaign.thumbnailUrl,
    previewUrl: domainCampaign.previewUrl,
    visibility: domainCampaign.visibility,
    currencyId: domainCampaign.currencyId,
    payoutType: domainCampaign.payoutStructure,
    payoutAmount: domainCampaign.payoutAmount,
    revenueType: domainCampaign.revenueStructure,
    revenueAmount: domainCampaign.revenueAmount,
    conversionMethod: domainCampaign.conversionMethod,
    sessionDefinition: domainCampaign.sessionDefinition,
    sessionDuration: domainCampaign.sessionDuration,
    termsAndConditions: domainCampaign.termsAndConditions,
    internalNotes: domainCampaign.internalNotes,
    
    offers: [] // No offers endpoint available in current API
  };
};

export const campaignService = {
  // Get all campaigns - using real API with organizationsOrganizationIdCampaignsGet
  getCampaigns: async (organizationId: number = 2): Promise<Campaign[]> => {
    try {
      console.log(`Fetching campaigns for organization ID: ${organizationId}`);
      
      const campaignsApi = await createApiClient(CampaignsApi);
      const response: ModelsCampaignListResponse = await campaignsApi.organizationsOrganizationIdCampaignsGet({
        organizationId: organizationId,
        page: 1,
        pageSize: 100
      });
      
      console.log('API response for campaigns:', response);
      
      if (!response.campaigns) {
        console.log('No campaigns found in response');
        return [];
      }
      
      return response.campaigns.map(mapToCampaign);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw handleApiError(error);
    }
  },
  
  // Get a single campaign with details using campaignsIdGet
  getCampaign: async (id: string): Promise<CampaignDetail | null> => {
    try {
      console.log(`Fetching campaign with id ${id} from API`);
      
      const campaignsApi = await createApiClient(CampaignsApi);
      const response: ModelsCampaignResponse = await campaignsApi.campaignsIdGet({
        id: Number(id)
      });
      
      console.log(`Found campaign:`, response);
      return mapToCampaignDetail(response);
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
