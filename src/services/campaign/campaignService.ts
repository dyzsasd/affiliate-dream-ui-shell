
import { 
  ModelsCreateCampaignRequest,
  ModelsUpdateCampaignRequest
} from '@/generated-api/src/models';
import { Campaign, CampaignDetail } from '@/types/api';
import { CampaignApiClient } from './apiClient';
import { mapToCampaign, mapToCampaignDetail } from './mappers';

class CampaignService {
  private apiClient: CampaignApiClient;

  constructor() {
    this.apiClient = new CampaignApiClient();
  }

  // Get all campaigns - using real API with organizationsOrganizationIdCampaignsGet
  async getCampaigns(organizationId: number = 2): Promise<Campaign[]> {
    const response = await this.apiClient.getCampaignsByOrganization(organizationId);
    
    if (!response.campaigns) {
      console.log('No campaigns found in response');
      return [];
    }
    
    return response.campaigns.map(mapToCampaign);
  }
  
  // Get a single campaign with details using campaignsIdGet
  async getCampaign(id: string): Promise<CampaignDetail | null> {
    const response = await this.apiClient.getCampaignById(Number(id));
    return mapToCampaignDetail(response);
  }
  
  
  // Create a new campaign from a form request
  async createCampaignFromRequest(request: ModelsCreateCampaignRequest): Promise<Campaign> {
    const response = await this.apiClient.createCampaign(request);
    return mapToCampaign(response);
  }
  
  // Create a new campaign (legacy method)
  async createCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
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
    
    const response = await this.apiClient.createCampaign(request);
    return mapToCampaign(response);
  }
  
  // Update an existing campaign
  async updateCampaign(id: string, campaignData: Partial<Campaign>): Promise<Campaign> {
    // Create a valid request object
    const request: ModelsUpdateCampaignRequest = {
      name: campaignData.name || '',
      description: campaignData.description,
      status: campaignData.status || 'draft',
      startDate: campaignData.startDate,
      endDate: campaignData.endDate
    };
    
    const response = await this.apiClient.updateCampaign(Number(id), request);
    return mapToCampaign(response);
  }
  
  // Delete a campaign
  async deleteCampaign(id: string): Promise<void> {
    await this.apiClient.deleteCampaign(Number(id));
  }
}

// Export a singleton instance
export const campaignService = new CampaignService();
