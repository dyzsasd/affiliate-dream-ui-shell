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

// Centralized mock campaigns data
const getMockCampaigns = () => [
  {
    "campaign_id": 1,
    "organization_id": 5,
    "advertiser_id": 1,
    "name": "Adidas Summer Collection 2025",
    "description": "Promote the latest Adidas summer sportswear collection with attractive commissions",
    "status": "active",
    "start_date": "2025-06-01T00:00:00Z",
    "end_date": "2025-08-31T00:00:00Z",
    "destination_url": "https://adidas.com/summer-collection",
    "thumbnail_url": "https://example.com/adidas-summer-thumb.jpg",
    "preview_url": "https://example.com/adidas-summer-preview.jpg",
    "visibility": "public",
    "currency_id": "EUR",
    "payout_type": "cpa",
    "payout_amount": 35.0,
    "revenue_type": "rpa",
    "revenue_amount": 45.0,
    "conversion_method": "postback",
    "session_definition": "30-day attribution window",
    "session_duration": 30,
    "terms_and_conditions": "Standard affiliate terms apply. Minimum 10 conversions per month required.",
    "internal_notes": "High-performing campaign for Q2/Q3 2025",
    "created_at": "2025-05-15T10:30:00.000Z",
    "updated_at": "2025-06-10T14:20:00.000Z"
  },
  {
    "campaign_id": 2,
    "organization_id": 5,
    "advertiser_id": 1,
    "name": "Nike Air Max Promotion",
    "description": "Exclusive promotion for Nike Air Max sneakers with limited-time offers",
    "status": "active",
    "start_date": "2025-06-15T00:00:00Z",
    "end_date": "2025-07-31T00:00:00Z",
    "destination_url": "https://nike.com/air-max-promo",
    "thumbnail_url": "https://example.com/nike-airmax-thumb.jpg",
    "preview_url": "https://example.com/nike-airmax-preview.jpg",
    "visibility": "public",
    "currency_id": "USD",
    "payout_type": "cpa",
    "payout_amount": 28.5,
    "revenue_type": "rpa",
    "revenue_amount": 35.0,
    "conversion_method": "pixel",
    "session_definition": "7-day click, 1-day view attribution",
    "session_duration": 7,
    "terms_and_conditions": "US traffic only. No incentive traffic allowed.",
    "internal_notes": "Nike's summer push for Air Max line",
    "created_at": "2025-06-01T09:15:00.000Z",
    "updated_at": "2025-06-12T16:45:00.000Z"
  },
  {
    "campaign_id": 3,
    "organization_id": 5,
    "advertiser_id": 2,
    "name": "Puma Lifestyle Campaign",
    "description": "Comprehensive lifestyle campaign covering shoes, apparel, and accessories",
    "status": "paused",
    "start_date": "2025-05-01T00:00:00Z",
    "end_date": "2025-09-30T00:00:00Z",
    "destination_url": "https://puma.com/lifestyle",
    "thumbnail_url": "https://example.com/puma-lifestyle-thumb.jpg",
    "preview_url": "https://example.com/puma-lifestyle-preview.jpg",
    "visibility": "private",
    "currency_id": "GBP",
    "payout_type": "revshare",
    "payout_amount": 8.5,
    "revenue_type": "revshare",
    "revenue_amount": 12.0,
    "conversion_method": "postback",
    "session_definition": "14-day attribution window",
    "session_duration": 14,
    "terms_and_conditions": "UK and EU traffic only. Brand bidding prohibited.",
    "internal_notes": "Currently paused for optimization",
    "created_at": "2025-04-20T11:00:00.000Z",
    "updated_at": "2025-06-05T13:30:00.000Z"
  },
  {
    "campaign_id": 4,
    "organization_id": 5,
    "advertiser_id": 3,
    "name": "Under Armour Fitness Challenge",
    "description": "Promote Under Armour's fitness gear with performance tracking integration",
    "status": "draft",
    "start_date": "2025-07-01T00:00:00Z",
    "end_date": "2025-12-31T00:00:00Z",
    "destination_url": "https://underarmour.com/fitness-challenge",
    "thumbnail_url": "https://example.com/ua-fitness-thumb.jpg",
    "preview_url": "https://example.com/ua-fitness-preview.jpg",
    "visibility": "public",
    "currency_id": "USD",
    "payout_type": "cpa",
    "payout_amount": 22.0,
    "revenue_type": "rpa",
    "revenue_amount": 28.0,
    "conversion_method": "api",
    "session_definition": "45-day attribution window",
    "session_duration": 45,
    "terms_and_conditions": "Draft terms - subject to change before launch",
    "internal_notes": "Preparing for Q3 launch",
    "created_at": "2025-06-10T08:00:00.000Z",
    "updated_at": "2025-06-18T12:15:00.000Z"
  },
  {
    "campaign_id": 5,
    "organization_id": 5,
    "advertiser_id": 4,
    "name": "Reebok CrossFit Partnership",
    "description": "Partnership campaign targeting CrossFit enthusiasts and gym owners",
    "status": "active",
    "start_date": "2025-06-01T00:00:00Z",
    "end_date": "2025-11-30T00:00:00Z",
    "destination_url": "https://reebok.com/crossfit",
    "thumbnail_url": "https://example.com/reebok-crossfit-thumb.jpg",
    "preview_url": "https://example.com/reebok-crossfit-preview.jpg",
    "visibility": "public",
    "currency_id": "USD",
    "payout_type": "hybrid",
    "payout_amount": 15.0,
    "revenue_type": "hybrid",
    "revenue_amount": 20.0,
    "conversion_method": "postback",
    "session_definition": "21-day attribution window",
    "session_duration": 21,
    "terms_and_conditions": "Fitness and sports traffic preferred. Volume bonuses available.",
    "internal_notes": "Strong performer in fitness vertical",
    "created_at": "2025-05-25T14:45:00.000Z",
    "updated_at": "2025-06-15T10:20:00.000Z"
  },
  {
    "campaign_id": 6,
    "organization_id": 5,
    "advertiser_id": 5,
    "name": "New Balance Running Series",
    "description": "Seasonal campaign focusing on New Balance running shoes and apparel",
    "status": "active",
    "start_date": "2025-06-01T00:00:00Z",
    "end_date": "2025-08-31T00:00:00Z",
    "destination_url": "https://newbalance.com/running",
    "thumbnail_url": "https://example.com/nb-running-thumb.jpg",
    "preview_url": "https://example.com/nb-running-preview.jpg",
    "visibility": "public",
    "currency_id": "USD",
    "payout_type": "cpa",
    "payout_amount": 32.0,
    "revenue_type": "rpa",
    "revenue_amount": 40.0,
    "conversion_method": "pixel",
    "session_definition": "30-day click attribution",
    "session_duration": 30,
    "terms_and_conditions": "Running and fitness verticals only. No PPC on brand terms.",
    "internal_notes": "Summer running season focus",
    "created_at": "2025-05-30T16:30:00.000Z",
    "updated_at": "2025-06-17T11:45:00.000Z"
  }
];

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
  // Get all campaigns - using updated mock data
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      console.log('Fetching campaigns with updated mock data');
      
      const mockCampaigns = getMockCampaigns();
      return mockCampaigns.map(mapToCampaign);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw handleApiError(error);
    }
  },
  
  // Get a single campaign with details
  getCampaign: async (id: string): Promise<CampaignDetail | null> => {
    try {
      console.log(`Fetching campaign with id ${id} from mock data`);
      
      const mockCampaigns = getMockCampaigns();
      const campaign = mockCampaigns.find(c => String(c.campaign_id) === id);
      
      if (!campaign) {
        console.log(`Campaign with id ${id} not found in mock data`);
        return null;
      }
      
      console.log(`Found campaign:`, campaign);
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
