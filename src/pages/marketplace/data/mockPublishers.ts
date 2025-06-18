
import { Publisher } from "../types/publisher";

export const mockPublishers: Publisher[] = [
  {
    id: "1",
    name: "TechReviews Pro",
    logo: "/placeholder.svg",
    description: "Leading technology review channel with focus on consumer electronics and software reviews.",
    categories: ["Technology", "Electronics", "Software"],
    country: "United States",
    averageEPC: 2.45,
    conversionRate: 3.2,
    rating: 4.8,
    reviewCount: 156,
    isVerified: true,
    tags: ["Tech Reviews", "High Converting", "Premium Traffic"],
    trafficSources: ["YouTube", "Blog", "Social Media"],
    monthlyTraffic: 2500000,
    primaryAudience: {
      ageRange: "25-45",
      gender: "Mixed",
      interests: ["Technology", "Gaming", "Gadgets"]
    },
    payoutModels: ["CPC", "CPA", "Revenue Share"],
    contactEmail: "partnerships@techreviews.com",
    website: "https://techreviews.com",
    joinedDate: "2021-03-15",
    lastActive: "2024-06-17",
    socialMedia: {
      youtube: "https://youtube.com/techreviews",
      twitter: "https://twitter.com/techreviews",
      instagram: "https://instagram.com/techreviews"
    },
    performance: {
      totalClicks: 1250000,
      totalConversions: 40000,
      totalRevenue: 98000,
      averageOrderValue: 245
    },
    topCategories: [
      { category: "Electronics", percentage: 45 },
      { category: "Software", percentage: 35 },
      { category: "Gaming", percentage: 20 }
    ]
  },
  {
    id: "2",
    name: "Fashion Forward",
    logo: "/placeholder.svg",
    description: "Trendy fashion and lifestyle content creator specializing in affordable fashion finds.",
    categories: ["Fashion", "Lifestyle", "Beauty"],
    country: "United Kingdom",
    averageEPC: 1.85,
    conversionRate: 4.1,
    rating: 4.6,
    reviewCount: 89,
    isVerified: true,
    tags: ["Fashion", "Lifestyle", "Female Audience"],
    trafficSources: ["Instagram", "TikTok", "Blog"],
    monthlyTraffic: 1800000,
    primaryAudience: {
      ageRange: "18-35",
      gender: "Female",
      interests: ["Fashion", "Beauty", "Shopping"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "hello@fashionforward.co.uk",
    website: "https://fashionforward.co.uk",
    joinedDate: "2022-01-10",
    lastActive: "2024-06-18",
    socialMedia: {
      instagram: "https://instagram.com/fashionforward",
      tiktok: "https://tiktok.com/@fashionforward",
      youtube: "https://youtube.com/fashionforward"
    },
    performance: {
      totalClicks: 950000,
      totalConversions: 38950,
      totalRevenue: 72000,
      averageOrderValue: 185
    },
    topCategories: [
      { category: "Fashion", percentage: 60 },
      { category: "Beauty", percentage: 25 },
      { category: "Accessories", percentage: 15 }
    ]
  },
  {
    id: "3",
    name: "Fitness Guru",
    logo: "/placeholder.svg",
    description: "Health and fitness expert sharing workout routines, nutrition tips, and wellness products.",
    categories: ["Health", "Fitness", "Nutrition"],
    country: "Canada",
    averageEPC: 3.12,
    conversionRate: 2.8,
    rating: 4.9,
    reviewCount: 203,
    isVerified: true,
    tags: ["Fitness", "Health", "High Engagement"],
    trafficSources: ["YouTube", "App", "Website"],
    monthlyTraffic: 3200000,
    primaryAudience: {
      ageRange: "22-50",
      gender: "Mixed",
      interests: ["Fitness", "Health", "Nutrition"]
    },
    payoutModels: ["CPC", "CPA", "CPM"],
    contactEmail: "partnerships@fitnessguru.ca",
    website: "https://fitnessguru.ca",
    joinedDate: "2020-08-22",
    lastActive: "2024-06-18",
    socialMedia: {
      youtube: "https://youtube.com/fitnessguru",
      instagram: "https://instagram.com/fitnessguru",
      facebook: "https://facebook.com/fitnessguru"
    },
    performance: {
      totalClicks: 1800000,
      totalConversions: 50400,
      totalRevenue: 157000,
      averageOrderValue: 312
    },
    topCategories: [
      { category: "Supplements", percentage: 40 },
      { category: "Equipment", percentage: 35 },
      { category: "Apparel", percentage: 25 }
    ]
  },
  {
    id: "4",
    name: "Home & Garden Enthusiast",
    logo: "/placeholder.svg",
    description: "DIY home improvement and gardening content with practical tips and product recommendations.",
    categories: ["Home & Garden", "DIY", "Tools"],
    country: "Australia",
    averageEPC: 2.78,
    conversionRate: 3.5,
    rating: 4.7,
    reviewCount: 127,
    isVerified: false,
    tags: ["Home Improvement", "Gardening", "DIY"],
    trafficSources: ["Blog", "Pinterest", "YouTube"],
    monthlyTraffic: 1600000,
    primaryAudience: {
      ageRange: "30-60",
      gender: "Mixed",
      interests: ["Home Improvement", "Gardening", "DIY"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "contact@homegardenthusiast.au",
    website: "https://homegardenthusiast.au",
    joinedDate: "2021-11-05",
    lastActive: "2024-06-16",
    socialMedia: {
      youtube: "https://youtube.com/homegardenthusiast",
      instagram: "https://instagram.com/homegardenthusiast"
    },
    performance: {
      totalClicks: 720000,
      totalConversions: 25200,
      totalRevenue: 70000,
      averageOrderValue: 278
    },
    topCategories: [
      { category: "Tools", percentage: 35 },
      { category: "Garden", percentage: 40 },
      { category: "Home Decor", percentage: 25 }
    ]
  },
  {
    id: "5",
    name: "Travel Wanderlust",
    logo: "/placeholder.svg",
    description: "Adventure travel blogger documenting unique destinations and travel gear recommendations.",
    categories: ["Travel", "Adventure", "Lifestyle"],
    country: "Germany",
    averageEPC: 1.92,
    conversionRate: 2.1,
    rating: 4.4,
    reviewCount: 94,
    isVerified: true,
    tags: ["Travel", "Adventure", "European Audience"],
    trafficSources: ["Blog", "Instagram", "YouTube"],
    monthlyTraffic: 1200000,
    primaryAudience: {
      ageRange: "25-45",
      gender: "Mixed",
      interests: ["Travel", "Adventure", "Photography"]
    },
    payoutModels: ["CPC", "CPA"],
    contactEmail: "hello@travelwanderlust.de",
    website: "https://travelwanderlust.de",
    joinedDate: "2022-05-18",
    lastActive: "2024-06-15",
    socialMedia: {
      instagram: "https://instagram.com/travelwanderlust",
      youtube: "https://youtube.com/travelwanderlust",
      facebook: "https://facebook.com/travelwanderlust"
    },
    performance: {
      totalClicks: 480000,
      totalConversions: 10080,
      totalRevenue: 19400,
      averageOrderValue: 192
    },
    topCategories: [
      { category: "Travel Gear", percentage: 45 },
      { category: "Accommodation", percentage: 30 },
      { category: "Activities", percentage: 25 }
    ]
  }
];
