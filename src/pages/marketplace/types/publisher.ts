
export interface Publisher {
  id: string;
  name: string;
  logo: string;
  description: string;
  categories: string[];
  country: string;
  averageEPC: number;
  conversionRate: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  tags: string[];
  trafficSources: string[];
  monthlyTraffic: number;
  primaryAudience: {
    ageRange: string;
    gender: string;
    interests: string[];
  };
  payoutModels: string[];
  contactEmail: string;
  website: string;
  joinedDate: string;
  lastActive: string;
  socialMedia: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    facebook?: string;
  };
  performance: {
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  topCategories: {
    category: string;
    percentage: number;
  }[];
}
