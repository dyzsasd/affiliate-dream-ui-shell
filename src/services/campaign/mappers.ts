

import { 
  ModelsCampaignResponse
} from '@/generated-api/src/models';
import { Campaign, CampaignDetail } from '@/types/api';

// Map backend campaign model to frontend Campaign type
export const mapToCampaign = (domainCampaign: ModelsCampaignResponse): Campaign => {
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
export const mapToCampaignDetail = (domainCampaign: ModelsCampaignResponse): CampaignDetail => {
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
    conversionMethod: domainCampaign.conversionMethod,
    sessionDefinition: domainCampaign.sessionDefinition,
    sessionDuration: domainCampaign.sessionDuration,
    termsAndConditions: domainCampaign.termsAndConditions,
    internalNotes: domainCampaign.internalNotes,
    
    // Simplified billing configuration - use fixed revenue as base
    fixedRevenue: domainCampaign.fixedRevenue || 0,
    
    // Click-based payout amounts
    fixedClickAmount: domainCampaign.fixedClickAmount || 0,
    
    // Conversion-based payout amounts  
    fixedConversionAmount: domainCampaign.fixedConversionAmount || 0,
    percentageConversionAmount: domainCampaign.percentageConversionAmount || 0,
    
    // Caps and limits
    isCapsEnabled: domainCampaign.isCapsEnabled || false,
    dailyClickCap: domainCampaign.dailyClickCap || 0,
    dailyConversionCap: domainCampaign.dailyConversionCap || 0,
    weeklyClickCap: domainCampaign.weeklyClickCap || 0,
    weeklyConversionCap: domainCampaign.weeklyConversionCap || 0,
    monthlyClickCap: domainCampaign.monthlyClickCap || 0,
    monthlyConversionCap: domainCampaign.monthlyConversionCap || 0,
    globalClickCap: domainCampaign.globalClickCap || 0,
    globalConversionCap: domainCampaign.globalConversionCap || 0,
    
    offers: [] // No offers endpoint available in current API
  };
};

