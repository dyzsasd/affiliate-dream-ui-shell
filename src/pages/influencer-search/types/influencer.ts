
export interface SocialMediaProfile {
  platform: string;
  handle: string;
  followers: number;
  score: number;
  engagementRate: number;
  growth: number;
}

export interface InfluencerCampaignRipeness {
  priceRange: string;
  audienceTarget: string;
  engagementDescription: string;
  brandSuitability: string;
  partnershipLikelihood: string;
}

export interface ContentStyle {
  type: string;
  brandSafety: 'Very safe' | 'Safe' | 'Moderate' | 'Risky';
  engagement: 'Very good' | 'Good' | 'Average' | 'Poor';
}

export interface Influencer {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  language: string;
  category: string;
  industries: string[];
  influenceScore: number;
  totalPoints: number;
  lastUpdated: string;
  profileOverview: string;
  quote?: string;
  socialMediaProfiles: SocialMediaProfile[];
  campaignRipeness: InfluencerCampaignRipeness;
  contentStyle: ContentStyle;
  isVerified: boolean;
  tags: string[];
}

export interface SearchFilters {
  profileType: 'all' | 'creators' | 'brands';
  gender: 'all' | 'male' | 'female';
  tier: string;
  socialMedia: string[];
  followersMin: number;
  followersMax: number;
  growthMin: number;
  growthMax: number;
  engagementMin: number;
  engagementMax: number;
  avgEngagementMin: number;
  avgEngagementMax: number;
  industry: string;
  region: string;
  city: string;
  language: string;
  hideInCRM: boolean;
  onlyActiveAccounts: boolean;
  onlyWithEmail: boolean;
  onlyVerified: boolean;
  sortBy: string;
}
