// Mock data service for dashboard components
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