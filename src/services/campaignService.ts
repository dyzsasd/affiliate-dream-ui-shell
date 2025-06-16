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

// Mock data as provided
const mockCampaignsResponse = {
  "campaigns": [
    {
      "campaign_id": 6,
      "organization_id": 5,
      "advertiser_id": 1,
      "name": "Full Test Campaign",
      "description": "A comprehensive test campaign with all available fields",
      "status": "active",
      "start_date": "2025-07-01T00:00:00Z",
      "end_date": "2025-08-31T00:00:00Z",
      "destination_url": "https://example.com/landing",
      "thumbnail_url": "https://example.com/thumb.jpg",
      "preview_url": "https://example.com/preview.jpg",
      "visibility": "public",
      "currency_id": "USD",
      "payout_type": "cpa",
      "payout_amount": 25.5,
      "revenue_type": "rpa",
      "revenue_amount": 30,
      "conversion_method": "postback",
      "session_definition": "30-day attribution window",
      "session_duration": 30,
      "terms_and_conditions": "Standard affiliate terms apply",
      "internal_notes": "High-priority campaign for Q3",
      "created_at": "2025-06-16T23:58:51.831539+02:00",
      "updated_at": "2025-06-16T23:58:51.831539+02:00"
    },
    {
      "campaign_id": 5,
      "organization_id": 5,
      "advertiser_id": 1,
      "name": "Full Test Campaign",
      "description": "A comprehensive test campaign with all available fields",
      "status": "active",
      "start_date": "2025-07-01T00:00:00Z",
      "end_date": "2025-08-31T00:00:00Z",
      "destination_url": "https://example.com/landing",
      "thumbnail_url": "https://example.com/thumb.jpg",
      "preview_url": "https://example.com/preview.jpg",
      "visibility": "public",
      "currency_id": "USD",
      "payout_type": "cpa",
      "payout_amount": 25.5,
      "revenue_type": "rpa",
      "revenue_amount": 30,
      "created_at": "2025-06-16T23:58:51.104544+02:00",
      "updated_at": "2025-06-16T23:58:51.104544+02:00"
    },
    {
      "campaign_id": 4,
      "organization_id": 5,
      "advertiser_id": 1,
      "name": "Full Test Campaign",
      "description": "A comprehensive test campaign with all available fields",
      "status": "active",
      "start_date": "2025-07-01T00:00:00Z",
      "end_date": "2025-08-31T00:00:00Z",
      "destination_url": "https://example.com/landing",
      "thumbnail_url": "https://example.com/thumb.jpg",
      "preview_url": "https://example.com/preview.jpg",
      "visibility": "public",
      "currency_id": "USD",
      "payout_type": "cpa",
      "payout_amount": 25.5,
      "revenue_type": "rpa",
      "revenue_amount": 30,
      "created_at": "2025-06-16T23:58:49.107926+02:00",
      "updated_at": "2025-06-16T23:58:49.107926+02:00"
    },
    {
      "campaign_id": 3,
      "organization_id": 5,
      "advertiser_id": 1,
      "name": "Test Campaign via curl",
      "status": "draft",
      "created_at": "2025-06-16T23:41:40.185959+02:00",
      "updated_at": "2025-06-16T23:41:40.185959+02:00"
    },
    {
      "campaign_id": 2,
      "organization_id": 5,
      "advertiser_id": 1,
      "name": "Test Campaign via curl",
      "status": "draft",
      "created_at": "2025-06-16T23:41:36.800493+02:00",
      "updated_at": "2025-06-16T23:41:36.800493+02:00"
    }
  ],
  "total": 5,
  "page": 1,
  "page_size": 20
};

// Map backend campaign model to frontend Campaign type
const mapToCampaign = (domainCampaign: any): Campaign => {
  return {
    id: String(domainCampaign.campaign_id || ''),
    name: domainCampaign.name || '',
    description: domainCampaign.description || '',
    status: (domainCampaign.status as 'active' | 'paused' | 'draft') || 'draft',
    startDate: domainCampaign.start_date,
    endDate: domainCampaign.end_date,
    createdAt: domainCampaign.created_at || new Date().toISOString(),
    updatedAt: domainCampaign.updated_at || new Date().toISOString(),
  };
};

// Map backend campaign model to frontend CampaignDetail type
const mapToCampaignDetail = (domainCampaign: any): CampaignDetail => {
  return {
    id: String(domainCampaign.campaign_id || ''),
    name: domainCampaign.name || '',
    description: domainCampaign.description || '',
    status: (domainCampaign.status as 'active' | 'paused' | 'draft') || 'draft',
    startDate: domainCampaign.start_date,
    endDate: domainCampaign.end_date,
    createdAt: domainCampaign.created_at || new Date().toISOString(),
    updatedAt: domainCampaign.updated_at || new Date().toISOString(),
    
    // Additional fields from ModelsCampaignResponse
    campaignId: domainCampaign.campaign_id,
    advertiserId: domainCampaign.advertiser_id,
    organizationId: domainCampaign.organization_id,
    destinationUrl: domainCampaign.destination_url,
    thumbnailUrl: domainCampaign.thumbnail_url,
    previewUrl: domainCampaign.preview_url,
    visibility: domainCampaign.visibility,
    currencyId: domainCampaign.currency_id,
    payoutType: domainCampaign.payout_type,
    payoutAmount: domainCampaign.payout_amount,
    revenueType: domainCampaign.revenue_type,
    revenueAmount: domainCampaign.revenue_amount,
    conversionMethod: domainCampaign.conversion_method,
    sessionDefinition: domainCampaign.session_definition,
    sessionDuration: domainCampaign.session_duration,
    termsAndConditions: domainCampaign.terms_and_conditions,
    internalNotes: domainCampaign.internal_notes,
    
    offers: [] // No offers endpoint available in current API
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
  // Get all campaigns - using mock data for now
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      console.log('Fetching campaigns with mock data');
      
      // Return mock campaigns mapped to our Campaign type
      return mockCampaignsResponse.campaigns.map(mapToCampaign);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw handleApiError(error);
    }
  },
  
  // Get a single campaign with details
  getCampaign: async (id: string): Promise<CampaignDetail | null> => {
    try {
      console.log(`Fetching campaign with id ${id} from mock data`);
      
      const campaign = mockCampaignsResponse.campaigns.find(c => String(c.campaign_id) === id);
      
      if (!campaign) {
        return null;
      }
      
      return mapToCampaignDetail(campaign);
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
