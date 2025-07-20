
import { 
  CampaignsApi
} from '@/generated-api/src/apis';
import { 
  ModelsCampaignResponse, 
  ModelsCreateCampaignRequest,
  ModelsUpdateCampaignRequest,
  ModelsCampaignListResponse
} from '@/generated-api/src/models';
import { createApiClient, handleApiError } from '../backendApi';

export class CampaignApiClient {
  private async getApiClient() {
    return await createApiClient(CampaignsApi);
  }

  // Get all campaigns for an organization
  async getCampaignsByOrganization(organizationId: number, page: number = 1, pageSize: number = 100): Promise<ModelsCampaignListResponse> {
    try {
      console.log(`Fetching campaigns for organization ID: ${organizationId}`);
      console.log(`Debug: Getting API client with JWT token`);
      
      const campaignsApi = await this.getApiClient();
      console.log(`Debug: API client created, making request to organizationsOrganizationIdCampaignsGet`);
      const response = await campaignsApi.organizationsOrganizationIdCampaignsGet({
        organizationId: organizationId,
        page: page,
        pageSize: pageSize
      });
      
      console.log('API response for campaigns:', response);
      return response;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw handleApiError(error);
    }
  }

  // Get a single campaign by ID
  async getCampaignById(id: number): Promise<ModelsCampaignResponse> {
    try {
      console.log(`Fetching campaign with id ${id} from API`);
      
      const campaignsApi = await this.getApiClient();
      const response = await campaignsApi.campaignsIdGet({ id });
      
      console.log(`Found campaign:`, response);
      return response;
    } catch (error) {
      console.error(`Error fetching campaign with id ${id}:`, error);
      throw handleApiError(error);
    }
  }

  // Create a new campaign
  async createCampaign(request: ModelsCreateCampaignRequest): Promise<ModelsCampaignResponse> {
    try {
      const campaignsApi = await this.getApiClient();
      const response = await campaignsApi.campaignsPost({ campaign: request });
      return response;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw handleApiError(error);
    }
  }

  // Update an existing campaign
  async updateCampaign(id: number, request: ModelsUpdateCampaignRequest): Promise<ModelsCampaignResponse> {
    try {
      const campaignsApi = await this.getApiClient();
      const response = await campaignsApi.campaignsIdPut({
        id: id,
        campaign: request
      });
      return response;
    } catch (error) {
      console.error(`Error updating campaign with id ${id}:`, error);
      throw handleApiError(error);
    }
  }

  // Delete a campaign
  async deleteCampaign(id: number): Promise<void> {
    try {
      const campaignsApi = await this.getApiClient();
      await campaignsApi.campaignsIdDelete({ id });
    } catch (error) {
      console.error(`Error deleting campaign with id ${id}:`, error);
      throw handleApiError(error);
    }
  }
}
