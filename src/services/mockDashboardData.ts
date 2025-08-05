// Mock data service for dashboard and reporting components
import { addDays, subDays, format } from 'date-fns';

// Types for dashboard data
export interface DashboardMetrics {
  totalClicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  change: {
    clicks: string;
    conversions: string;
    revenue: string;
    conversionRate: string;
  };
}

export interface PerformanceDataPoint {
  date: string;
  clicks: number;
  conversions: number;
  revenue: number;
  impressions: number;
  ctr: number;
}

export interface CampaignSummary {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}

export interface PlatformMetrics {
  totalOrganizations: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  activeAdvertisers: number;
  activeAffiliates: number;
  totalCampaigns: number;
  totalClicks: number;
  platformConversionRate: number;
  averageRevenuePerUser: number;
}

export interface RecentActivity {
  id: string;
  type: 'campaign_created' | 'user_signup' | 'conversion' | 'payout' | 'organization_approved';
  description: string;
  timestamp: string;
  amount?: number;
  user?: string;
}

// Reporting-specific interfaces
export interface DetailedPerformanceData extends PerformanceDataPoint {
  campaignId: string;
  campaignName: string;
  country: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  source: string;
  cpc: number; // Cost per click
  cpm: number; // Cost per mille
  roas: number; // Return on ad spend
}

export interface ConversionDetail {
  id: string;
  timestamp: string;
  transactionId: string;
  campaignId: string;
  campaignName: string;
  offerId: string;
  offerName: string;
  status: 'pending' | 'approved' | 'rejected';
  payout: number;
  currency: string;
  affiliateId: string;
  affiliateName: string;
  country: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  ip: string;
  userAgent: string;
  referrer: string;
  subId1?: string;
  subId2?: string;
  subId3?: string;
}

export interface CampaignPerformanceReport {
  campaignId: string;
  campaignName: string;
  totalClicks: number;
  totalImpressions: number;
  totalConversions: number;
  totalRevenue: number;
  ctr: number;
  conversionRate: number;
  avgPayout: number;
  roas: number;
  performance: PerformanceDataPoint[];
}

export interface RecentActivity {
  id: string;
  type: 'campaign_created' | 'user_signup' | 'conversion' | 'payout' | 'organization_approved';
  description: string;
  timestamp: string;
  amount?: number;
  user?: string;
}

// Generate realistic performance data for the last 30 days
export const generatePerformanceData = (days: number = 30): PerformanceDataPoint[] => {
  const data: PerformanceDataPoint[] = [];
  const baseClicks = 1500;
  const baseRevenue = 2500;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    
    // Add some randomness but with realistic patterns
    const weekdayMultiplier = [0.7, 1.0, 1.1, 1.2, 1.3, 0.9, 0.6][date.getDay()]; // Lower on weekends
    const randomFactor = 0.7 + Math.random() * 0.6; // Random between 0.7 and 1.3
    
    const clicks = Math.round(baseClicks * weekdayMultiplier * randomFactor);
    const impressions = Math.round(clicks * (8 + Math.random() * 4)); // 8-12x clicks
    const conversions = Math.round(clicks * (0.02 + Math.random() * 0.03)); // 2-5% conversion rate
    const revenue = Math.round(conversions * (15 + Math.random() * 25)); // $15-40 per conversion
    const ctr = Number(((clicks / impressions) * 100).toFixed(2));
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      clicks,
      conversions,
      revenue,
      impressions,
      ctr,
    });
  }
  
  return data;
};

// Generate mock advertiser dashboard metrics
export const getAdvertiserDashboardMetrics = (): DashboardMetrics => {
  const performanceData = generatePerformanceData(30);
  const last30Days = performanceData.slice(-30);
  const previous30Days = performanceData.slice(-60, -30);
  
  // Calculate current period totals
  const totalClicks = last30Days.reduce((sum, item) => sum + item.clicks, 0);
  const conversions = last30Days.reduce((sum, item) => sum + item.conversions, 0);
  const revenue = last30Days.reduce((sum, item) => sum + item.revenue, 0);
  const conversionRate = totalClicks > 0 ? (conversions / totalClicks) * 100 : 0;
  
  // Calculate previous period totals for comparison
  const prevClicks = previous30Days.reduce((sum, item) => sum + item.clicks, 0);
  const prevConversions = previous30Days.reduce((sum, item) => sum + item.conversions, 0);
  const prevRevenue = previous30Days.reduce((sum, item) => sum + item.revenue, 0);
  const prevConversionRate = prevClicks > 0 ? (prevConversions / prevClicks) * 100 : 0;
  
  // Calculate percentage changes
  const clicksChange = prevClicks > 0 ? (((totalClicks - prevClicks) / prevClicks) * 100).toFixed(1) : '0';
  const conversionsChange = prevConversions > 0 ? (((conversions - prevConversions) / prevConversions) * 100).toFixed(1) : '0';
  const revenueChange = prevRevenue > 0 ? (((revenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : '0';
  const conversionRateChange = prevConversionRate > 0 ? (((conversionRate - prevConversionRate) / prevConversionRate) * 100).toFixed(1) : '0';
  
  return {
    totalClicks,
    conversions,
    revenue,
    conversionRate: Number(conversionRate.toFixed(2)),
    change: {
      clicks: `${Number(clicksChange) >= 0 ? '+' : ''}${clicksChange}%`,
      conversions: `${Number(conversionsChange) >= 0 ? '+' : ''}${conversionsChange}%`,
      revenue: `${Number(revenueChange) >= 0 ? '+' : ''}${revenueChange}%`,
      conversionRate: `${Number(conversionRateChange) >= 0 ? '+' : ''}${conversionRateChange}%`,
    },
  };
};

// Generate mock campaign summaries
export const getMockCampaignSummaries = (): CampaignSummary[] => {
  const campaigns = [
    { name: 'Summer Sale 2024', status: 'active' as const },
    { name: 'Holiday Promotions', status: 'active' as const },
    { name: 'New Product Launch', status: 'paused' as const },
    { name: 'Brand Awareness Campaign', status: 'active' as const },
    { name: 'Retargeting Campaign', status: 'draft' as const },
    { name: 'Mobile App Promotion', status: 'active' as const },
  ];
  
  return campaigns.map((campaign, index) => {
    const baseClicks = 800 + Math.random() * 1200;
    const clicks = Math.round(baseClicks);
    const conversions = Math.round(clicks * (0.015 + Math.random() * 0.035));
    const revenue = Math.round(conversions * (12 + Math.random() * 28));
    const conversionRate = Number(((conversions / clicks) * 100).toFixed(2));
    
    return {
      id: `campaign-${index + 1}`,
      ...campaign,
      clicks,
      conversions,
      revenue,
      conversionRate,
    };
  });
};

// Generate mock platform owner metrics
export const getPlatformOwnerMetrics = (): PlatformMetrics => {
  return {
    totalOrganizations: 47,
    totalUsers: 312,
    totalRevenue: 125000,
    monthlyGrowth: 8.5,
    activeAdvertisers: 23,
    activeAffiliates: 24,
    totalCampaigns: 156,
    totalClicks: 2840000,
    platformConversionRate: 3.2,
    averageRevenuePerUser: 400.64,
  };
};

// Generate mock recent activity
export const getRecentActivity = (): RecentActivity[] => {
  const activities = [
    {
      type: 'campaign_created' as const,
      description: 'New campaign "Black Friday Sale" created',
      user: 'Sarah Johnson',
    },
    {
      type: 'user_signup' as const,
      description: 'New affiliate user registered',
      user: 'Mike Chen',
    },
    {
      type: 'conversion' as const,
      description: 'Conversion tracked for Summer Sale campaign',
      amount: 45.00,
    },
    {
      type: 'organization_approved' as const,
      description: 'Organization "TechCorp Ltd" approved',
      user: 'Admin',
    },
    {
      type: 'payout' as const,
      description: 'Affiliate payout processed',
      amount: 1250.00,
      user: 'Alex Rodriguez',
    },
    {
      type: 'conversion' as const,
      description: 'High-value conversion tracked',
      amount: 125.00,
    },
  ];
  
  return activities.map((activity, index) => ({
    id: `activity-${index + 1}`,
    timestamp: format(subDays(new Date(), Math.floor(Math.random() * 7)), 'yyyy-MM-dd HH:mm:ss'),
    ...activity,
  }));
};

// Export performance data for charts (formatted for display)
export const getMockPerformanceData = (days: number = 30) => {
  return generatePerformanceData(days).map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd'),
  }));
};

// Real-time dashboard data (could be used for auto-refresh)
export const getDashboardRealTimeData = () => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const hour = now.getHours();
  
  // Simulate hourly data for today
  const hourlyData = [];
  for (let i = 0; i <= hour; i++) {
    const hourlyClicks = Math.round(50 + Math.random() * 100);
    const hourlyConversions = Math.round(hourlyClicks * (0.02 + Math.random() * 0.03));
    const hourlyRevenue = Math.round(hourlyConversions * (15 + Math.random() * 25));
    
    hourlyData.push({
      hour: i,
      clicks: hourlyClicks,
      conversions: hourlyConversions,
      revenue: hourlyRevenue,
    });
  }
  
  const todayTotals = hourlyData.reduce(
    (acc, curr) => ({
      clicks: acc.clicks + curr.clicks,
      conversions: acc.conversions + curr.conversions,
      revenue: acc.revenue + curr.revenue,
    }),
    { clicks: 0, conversions: 0, revenue: 0 }
  );
  
  return {
    todayTotals,
    hourlyData,
    lastUpdate: format(now, 'HH:mm:ss'),
  };
};

// REPORTING-SPECIFIC MOCK DATA

// Generate detailed performance data with campaign, country, and device breakdowns
export const generateDetailedPerformanceData = (days: number = 30): DetailedPerformanceData[] => {
  const campaigns = [
    { id: '1', name: 'Summer Sale 2024' },
    { id: '2', name: 'Holiday Promotions' },
    { id: '3', name: 'New Product Launch' },
    { id: '4', name: 'Brand Awareness Campaign' },
  ];
  
  const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT'];
  const deviceTypes: ('desktop' | 'mobile' | 'tablet')[] = ['desktop', 'mobile', 'tablet'];
  const sources = ['Google Ads', 'Facebook', 'Instagram', 'Twitter', 'TikTok', 'Email', 'Direct'];
  
  const data: DetailedPerformanceData[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    
    // Generate multiple entries per day for different campaigns/countries/devices
    for (let j = 0; j < 3 + Math.floor(Math.random() * 3); j++) {
      const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      const weekdayMultiplier = [0.7, 1.0, 1.1, 1.2, 1.3, 0.9, 0.6][date.getDay()];
      const baseClicks = 200 + Math.random() * 300;
      const clicks = Math.round(baseClicks * weekdayMultiplier);
      const impressions = Math.round(clicks * (8 + Math.random() * 4));
      const conversions = Math.round(clicks * (0.015 + Math.random() * 0.035));
      const revenue = Math.round(conversions * (15 + Math.random() * 25));
      const ctr = Number(((clicks / impressions) * 100).toFixed(2));
      const cpc = Number((revenue / clicks * 0.7).toFixed(2)); // 70% of revenue per click
      const cpm = Number((revenue / impressions * 1000).toFixed(2));
      const roas = revenue > 0 ? Number((revenue / (cpc * clicks)).toFixed(2)) : 0;
      
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        clicks,
        conversions,
        revenue,
        impressions,
        ctr,
        campaignId: campaign.id,
        campaignName: campaign.name,
        country,
        deviceType,
        source,
        cpc,
        cpm,
        roas,
      });
    }
  }
  
  return data;
};

// Generate detailed conversion data
export const generateDetailedConversions = (count: number = 100): ConversionDetail[] => {
  const campaigns = [
    { id: '1', name: 'Summer Sale 2024' },
    { id: '2', name: 'Holiday Promotions' },
    { id: '3', name: 'New Product Launch' },
  ];
  
  const offers = [
    { id: 'offer-1', name: '20% Discount Offer' },
    { id: 'offer-2', name: 'Free Shipping Offer' },
    { id: 'offer-3', name: 'Premium Subscription' },
  ];
  
  const affiliates = [
    { id: 'aff-1', name: 'PromoMax Networks' },
    { id: 'aff-2', name: 'DigitalBoost Ltd' },
    { id: 'aff-3', name: 'AdVantage Partners' },
    { id: 'aff-4', name: 'ConvertPro Agency' },
  ];
  
  const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT'];
  const deviceTypes: ('desktop' | 'mobile' | 'tablet')[] = ['desktop', 'mobile', 'tablet'];
  const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected'];
  
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
  ];
  
  const referrers = [
    'https://google.com',
    'https://facebook.com',
    'https://instagram.com',
    'https://twitter.com',
    'https://example-affiliate-site.com',
  ];
  
  return Array.from({ length: count }, (_, index) => {
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const offer = offers[Math.floor(Math.random() * offers.length)];
    const affiliate = affiliates[Math.floor(Math.random() * affiliates.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const referrer = referrers[Math.floor(Math.random() * referrers.length)];
    
    // Status-based approval rates: 70% approved, 20% pending, 10% rejected
    const statusWeight = Math.random();
    const finalStatus = statusWeight < 0.7 ? 'approved' : statusWeight < 0.9 ? 'pending' : 'rejected';
    
    return {
      id: `conv-${String(index + 1).padStart(4, '0')}`,
      timestamp: format(
        subDays(new Date(), Math.floor(Math.random() * 30)), 
        'yyyy-MM-dd HH:mm:ss'
      ),
      transactionId: `tx-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      campaignId: campaign.id,
      campaignName: campaign.name,
      offerId: offer.id,
      offerName: offer.name,
      status: finalStatus,
      payout: Number((Math.random() * 50 + 10).toFixed(2)),
      currency: 'USD',
      affiliateId: affiliate.id,
      affiliateName: affiliate.name,
      country,
      deviceType,
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent,
      referrer,
      subId1: Math.random() > 0.7 ? `sub1_${Math.floor(Math.random() * 1000)}` : undefined,
      subId2: Math.random() > 0.8 ? `sub2_${Math.floor(Math.random() * 1000)}` : undefined,
      subId3: Math.random() > 0.9 ? `sub3_${Math.floor(Math.random() * 1000)}` : undefined,
    };
  });
};

// Generate campaign performance reports
export const getCampaignPerformanceReports = (): CampaignPerformanceReport[] => {
  const campaigns = [
    { id: '1', name: 'Summer Sale 2024' },
    { id: '2', name: 'Holiday Promotions' },
    { id: '3', name: 'New Product Launch' },
    { id: '4', name: 'Brand Awareness Campaign' },
  ];
  
  return campaigns.map(campaign => {
    const performance = generatePerformanceData(30);
    const totalClicks = performance.reduce((sum, p) => sum + p.clicks, 0);
    const totalImpressions = performance.reduce((sum, p) => sum + p.impressions, 0);
    const totalConversions = performance.reduce((sum, p) => sum + p.conversions, 0);
    const totalRevenue = performance.reduce((sum, p) => sum + p.revenue, 0);
    
    return {
      campaignId: campaign.id,
      campaignName: campaign.name,
      totalClicks,
      totalImpressions,
      totalConversions,
      totalRevenue,
      ctr: Number(((totalClicks / totalImpressions) * 100).toFixed(2)),
      conversionRate: Number(((totalConversions / totalClicks) * 100).toFixed(2)),
      avgPayout: totalConversions > 0 ? Number((totalRevenue / totalConversions).toFixed(2)) : 0,
      roas: Number((totalRevenue / (totalClicks * 0.5)).toFixed(2)), // Assume $0.50 CPC
      performance,
    };
  });
};

// Get reporting performance data for different date ranges
export const getReportingPerformanceData = (dateRange: string) => {
  const days = {
    '7days': 7,
    '30days': 30,
    '90days': 90,
    'year': 365,
  }[dateRange] || 30;
  
  return generatePerformanceData(days).map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd'),
  }));
};

// Get filtered conversions for conversion report
export const getFilteredConversions = (
  dateRange: string,
  statusFilter: string,
  searchTerm: string
): ConversionDetail[] => {
  let conversions = generateDetailedConversions(100);
  
  // Filter by date range
  const days = {
    '7days': 7,
    '30days': 30,
    '90days': 90,
    'year': 365,
  }[dateRange] || 30;
  
  const cutoffDate = subDays(new Date(), days);
  conversions = conversions.filter(conv => 
    new Date(conv.timestamp) >= cutoffDate
  );
  
  // Filter by status
  if (statusFilter !== 'all') {
    conversions = conversions.filter(conv => conv.status === statusFilter);
  }
  
  // Filter by search term
  if (searchTerm) {
    conversions = conversions.filter(conv =>
      conv.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.affiliateName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Sort by timestamp descending
  return conversions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};