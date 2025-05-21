
import { 
  CampaignsApi, 
  OffersApi 
} from '@/generated-api/src/apis';
import { 
  DomainCampaign, 
  DomainCampaignProviderOffer 
} from '@/generated-api/src/models';
import { createApiClient, handleApiError } from './backendApi';
import { Campaign, CampaignDetail, Offer } from '@/types/api';

// Map backend campaign model to frontend Campaign type
const mapToCampaign = (domainCampaign: DomainCampaign): Campaign => {
  return {
    id: domainCampaign.id || '',
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
  return {
    id: domainOffer.id || '',
    name: domainOffer.name || '',
    payoutType: (domainOffer.payoutType as 'CPA' | 'RevShare' | 'Hybrid') || 'CPA',
    payoutAmount: domainOffer.payoutAmount || 0,
    description: domainOffer.description,
  };
};

export const campaignService = {
  // Get all campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      const campaignsApi = await createApiClient(CampaignsApi);
      const response = await campaignsApi.campaignsGet();
      
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
      const campaign = await campaignsApi.campaignsIdGet({ id });
      
      if (!campaign) {
        return null;
      }
      
      // Fetch offers for this campaign
      const offersApi = await createApiClient(OffersApi);
      const offers = await offersApi.campaignsCampaignIdOffersGet({ campaignId: id });
      
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
      
      const response = await campaignsApi.campaignsPost({
        campaign: {
          name: campaignData.name || '',
          description: campaignData.description || '',
          status: campaignData.status || 'draft',
          startDate: campaignData.startDate,
          endDate: campaignData.endDate
        }
      });
      
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
      
      const response = await campaignsApi.campaignsIdPut({
        id,
        campaign: {
          name: campaignData.name,
          description: campaignData.description,
          status: campaignData.status,
          startDate: campaignData.startDate,
          endDate: campaignData.endDate
        }
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
      await campaignsApi.campaignsIdDelete({ id });
    } catch (error) {
      console.error(`Error deleting campaign with id ${id}:`, error);
      throw handleApiError(error);
    }
  }
};
