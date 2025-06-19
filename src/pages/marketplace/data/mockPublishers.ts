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
  },
  {
    id: "6",
    name: "Gaming Central",
    logo: "/placeholder.svg",
    description: "Gaming content creator covering reviews, walkthroughs, and gaming hardware recommendations.",
    categories: ["Technology", "Gaming", "Electronics"],
    country: "United States",
    averageEPC: 2.89,
    conversionRate: 4.5,
    rating: 4.9,
    reviewCount: 312,
    isVerified: true,
    tags: ["Gaming", "Tech", "High Engagement"],
    trafficSources: ["YouTube", "Twitch", "Discord"],
    monthlyTraffic: 4200000,
    primaryAudience: {
      ageRange: "16-35",
      gender: "Mixed",
      interests: ["Gaming", "Technology", "Streaming"]
    },
    payoutModels: ["CPC", "CPA", "Revenue Share"],
    contactEmail: "partnerships@gamingcentral.com",
    website: "https://gamingcentral.com",
    joinedDate: "2020-05-12",
    lastActive: "2024-06-18",
    socialMedia: {
      youtube: "https://youtube.com/gamingcentral",
      twitch: "https://twitch.tv/gamingcentral",
      twitter: "https://twitter.com/gamingcentral"
    },
    performance: {
      totalClicks: 2100000,
      totalConversions: 94500,
      totalRevenue: 273000,
      averageOrderValue: 289
    },
    topCategories: [
      { category: "Gaming Hardware", percentage: 50 },
      { category: "Games", percentage: 30 },
      { category: "Streaming Gear", percentage: 20 }
    ]
  },
  {
    id: "7",
    name: "Beauty Box Reviews",
    logo: "/placeholder.svg",
    description: "Beauty and skincare product reviews with focus on affordable luxury and Korean beauty trends.",
    categories: ["Beauty", "Skincare", "Lifestyle"],
    country: "South Korea",
    averageEPC: 2.15,
    conversionRate: 5.2,
    rating: 4.7,
    reviewCount: 189,
    isVerified: true,
    tags: ["K-Beauty", "Skincare", "Product Reviews"],
    trafficSources: ["YouTube", "Instagram", "TikTok"],
    monthlyTraffic: 1900000,
    primaryAudience: {
      ageRange: "18-40",
      gender: "Female",
      interests: ["Beauty", "Skincare", "K-Pop"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "hello@beautyboxreviews.kr",
    website: "https://beautyboxreviews.kr",
    joinedDate: "2021-09-03",
    lastActive: "2024-06-17",
    socialMedia: {
      youtube: "https://youtube.com/beautyboxreviews",
      instagram: "https://instagram.com/beautyboxreviews",
      tiktok: "https://tiktok.com/@beautyboxreviews"
    },
    performance: {
      totalClicks: 1140000,
      totalConversions: 59280,
      totalRevenue: 127000,
      averageOrderValue: 214
    },
    topCategories: [
      { category: "Skincare", percentage: 55 },
      { category: "Makeup", percentage: 30 },
      { category: "Hair Care", percentage: 15 }
    ]
  },
  {
    id: "8",
    name: "Food & Cooking Mastery",
    logo: "/placeholder.svg",
    description: "Culinary expert sharing recipes, cooking techniques, and kitchen equipment reviews.",
    categories: ["Food", "Lifestyle", "Home & Garden"],
    country: "France",
    averageEPC: 1.67,
    conversionRate: 3.8,
    rating: 4.5,
    reviewCount: 143,
    isVerified: false,
    tags: ["Cooking", "Recipes", "Kitchen Tools"],
    trafficSources: ["Blog", "YouTube", "Pinterest"],
    monthlyTraffic: 1350000,
    primaryAudience: {
      ageRange: "25-55",
      gender: "Mixed",
      interests: ["Cooking", "Food", "Home Entertainment"]
    },
    payoutModels: ["CPC", "CPA"],
    contactEmail: "contact@foodmastery.fr",
    website: "https://foodmastery.fr",
    joinedDate: "2022-02-14",
    lastActive: "2024-06-16",
    socialMedia: {
      youtube: "https://youtube.com/foodmastery",
      instagram: "https://instagram.com/foodmastery",
      facebook: "https://facebook.com/foodmastery"
    },
    performance: {
      totalClicks: 675000,
      totalConversions: 25650,
      totalRevenue: 42800,
      averageOrderValue: 167
    },
    topCategories: [
      { category: "Kitchen Tools", percentage: 40 },
      { category: "Ingredients", percentage: 35 },
      { category: "Cookbooks", percentage: 25 }
    ]
  },
  {
    id: "9",
    name: "Pet Care Paradise",
    logo: "/placeholder.svg",
    description: "Comprehensive pet care advice, product reviews, and training tips for dog and cat owners.",
    categories: ["Pets", "Health", "Lifestyle"],
    country: "United States",
    averageEPC: 2.34,
    conversionRate: 4.2,
    rating: 4.8,
    reviewCount: 267,
    isVerified: true,
    tags: ["Pet Care", "Animal Health", "Training"],
    trafficSources: ["Blog", "YouTube", "Facebook"],
    monthlyTraffic: 2800000,
    primaryAudience: {
      ageRange: "25-60",
      gender: "Mixed",
      interests: ["Pets", "Animal Care", "Veterinary"]
    },
    payoutModels: ["CPC", "CPA", "Revenue Share"],
    contactEmail: "partnerships@petcareparadise.com",
    website: "https://petcareparadise.com",
    joinedDate: "2020-11-08",
    lastActive: "2024-06-18",
    socialMedia: {
      youtube: "https://youtube.com/petcareparadise",
      facebook: "https://facebook.com/petcareparadise",
      instagram: "https://instagram.com/petcareparadise"
    },
    performance: {
      totalClicks: 1680000,
      totalConversions: 70560,
      totalRevenue: 165000,
      averageOrderValue: 234
    },
    topCategories: [
      { category: "Pet Food", percentage: 45 },
      { category: "Pet Accessories", percentage: 30 },
      { category: "Health Products", percentage: 25 }
    ]
  },
  {
    id: "10",
    name: "Auto Enthusiast Hub",
    logo: "/placeholder.svg",
    description: "Car reviews, automotive news, and vehicle maintenance guides for car enthusiasts.",
    categories: ["Automotive", "Technology", "Lifestyle"],
    country: "Germany",
    averageEPC: 3.45,
    conversionRate: 2.9,
    rating: 4.6,
    reviewCount: 198,
    isVerified: true,
    tags: ["Automotive", "Car Reviews", "High Value"],
    trafficSources: ["YouTube", "Blog", "Social Media"],
    monthlyTraffic: 2100000,
    primaryAudience: {
      ageRange: "25-50",
      gender: "Male",
      interests: ["Cars", "Technology", "Motorsports"]
    },
    payoutModels: ["CPC", "CPA"],
    contactEmail: "partnerships@autohub.de",
    website: "https://autohub.de",
    joinedDate: "2021-04-20",
    lastActive: "2024-06-17",
    socialMedia: {
      youtube: "https://youtube.com/autohub",
      instagram: "https://instagram.com/autohub",
      twitter: "https://twitter.com/autohub"
    },
    performance: {
      totalClicks: 1260000,
      totalConversions: 36540,
      totalRevenue: 126000,
      averageOrderValue: 345
    },
    topCategories: [
      { category: "Car Parts", percentage: 50 },
      { category: "Tools", percentage: 30 },
      { category: "Accessories", percentage: 20 }
    ]
  },
  {
    id: "11",
    name: "Wellness & Mindfulness",
    logo: "/placeholder.svg",
    description: "Mental health awareness, meditation guides, and wellness product recommendations.",
    categories: ["Health", "Wellness", "Lifestyle"],
    country: "Sweden",
    averageEPC: 1.89,
    conversionRate: 3.6,
    rating: 4.9,
    reviewCount: 234,
    isVerified: true,
    tags: ["Wellness", "Mental Health", "Mindfulness"],
    trafficSources: ["App", "Blog", "Podcast"],
    monthlyTraffic: 1750000,
    primaryAudience: {
      ageRange: "25-45",
      gender: "Mixed",
      interests: ["Wellness", "Mental Health", "Meditation"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "hello@wellness-mindfulness.se",
    website: "https://wellness-mindfulness.se",
    joinedDate: "2021-07-12",
    lastActive: "2024-06-18",
    socialMedia: {
      instagram: "https://instagram.com/wellnessmindfulness",
      youtube: "https://youtube.com/wellnessmindfulness"
    },
    performance: {
      totalClicks: 875000,
      totalConversions: 31500,
      totalRevenue: 59500,
      averageOrderValue: 189
    },
    topCategories: [
      { category: "Supplements", percentage: 40 },
      { category: "Books", percentage: 35 },
      { category: "Apps", percentage: 25 }
    ]
  },
  {
    id: "12",
    name: "Outdoor Adventure Guide",
    logo: "/placeholder.svg",
    description: "Hiking, camping, and outdoor gear reviews for adventure seekers and nature lovers.",
    categories: ["Travel", "Sports", "Outdoor"],
    country: "Canada",
    averageEPC: 2.67,
    conversionRate: 3.1,
    rating: 4.7,
    reviewCount: 176,
    isVerified: true,
    tags: ["Outdoor", "Adventure", "Gear Reviews"],
    trafficSources: ["YouTube", "Blog", "Instagram"],
    monthlyTraffic: 1850000,
    primaryAudience: {
      ageRange: "22-50",
      gender: "Mixed",
      interests: ["Hiking", "Camping", "Outdoor Sports"]
    },
    payoutModels: ["CPC", "CPA", "Revenue Share"],
    contactEmail: "partnerships@outdooradventure.ca",
    website: "https://outdooradventure.ca",
    joinedDate: "2020-09-15",
    lastActive: "2024-06-17",
    socialMedia: {
      youtube: "https://youtube.com/outdooradventure",
      instagram: "https://instagram.com/outdooradventure"
    },
    performance: {
      totalClicks: 1110000,
      totalConversions: 34410,
      totalRevenue: 91900,
      averageOrderValue: 267
    },
    topCategories: [
      { category: "Camping Gear", percentage: 45 },
      { category: "Hiking Equipment", percentage: 35 },
      { category: "Outdoor Clothing", percentage: 20 }
    ]
  },
  {
    id: "13",
    name: "Photography Pro Tips",
    logo: "/placeholder.svg",
    description: "Photography tutorials, camera reviews, and editing software recommendations.",
    categories: ["Photography", "Technology", "Education"],
    country: "Japan",
    averageEPC: 2.23,
    conversionRate: 3.7,
    rating: 4.8,
    reviewCount: 145,
    isVerified: false,
    tags: ["Photography", "Camera Gear", "Education"],
    trafficSources: ["YouTube", "Blog", "Instagram"],
    monthlyTraffic: 1450000,
    primaryAudience: {
      ageRange: "20-45",
      gender: "Mixed",
      interests: ["Photography", "Art", "Technology"]
    },
    payoutModels: ["CPC", "CPA"],
    contactEmail: "contact@photographypro.jp",
    website: "https://photographypro.jp",
    joinedDate: "2021-12-01",
    lastActive: "2024-06-16",
    socialMedia: {
      youtube: "https://youtube.com/photographypro",
      instagram: "https://instagram.com/photographypro"
    },
    performance: {
      totalClicks: 870000,
      totalConversions: 32190,
      totalRevenue: 71800,
      averageOrderValue: 223
    },
    topCategories: [
      { category: "Camera Equipment", percentage: 60 },
      { category: "Software", percentage: 25 },
      { category: "Accessories", percentage: 15 }
    ]
  },
  {
    id: "14",
    name: "Smart Home Solutions",
    logo: "/placeholder.svg",
    description: "Smart home technology reviews, automation guides, and IoT device comparisons.",
    categories: ["Technology", "Home & Garden", "Electronics"],
    country: "Netherlands",
    averageEPC: 3.12,
    conversionRate: 2.8,
    rating: 4.6,
    reviewCount: 167,
    isVerified: true,
    tags: ["Smart Home", "IoT", "Automation"],
    trafficSources: ["YouTube", "Blog", "Tech Forums"],
    monthlyTraffic: 1650000,
    primaryAudience: {
      ageRange: "28-55",
      gender: "Mixed",
      interests: ["Smart Home", "Technology", "DIY"]
    },
    payoutModels: ["CPC", "CPA", "Revenue Share"],
    contactEmail: "partnerships@smarthomesolutions.nl",
    website: "https://smarthomesolutions.nl",
    joinedDate: "2021-06-08",
    lastActive: "2024-06-18",
    socialMedia: {
      youtube: "https://youtube.com/smarthomesolutions",
      twitter: "https://twitter.com/smarthomesol"
    },
    performance: {
      totalClicks: 990000,
      totalConversions: 27720,
      totalRevenue: 86500,
      averageOrderValue: 312
    },
    topCategories: [
      { category: "Smart Devices", percentage: 55 },
      { category: "Security Systems", percentage: 30 },
      { category: "Lighting", percentage: 15 }
    ]
  },
  {
    id: "15",
    name: "Parenting Made Easy",
    logo: "/placeholder.svg",
    description: "Parenting advice, child development tips, and family product recommendations.",
    categories: ["Family", "Health", "Education"],
    country: "Australia",
    averageEPC: 1.95,
    conversionRate: 4.3,
    rating: 4.7,
    reviewCount: 289,
    isVerified: true,
    tags: ["Parenting", "Family", "Child Development"],
    trafficSources: ["Blog", "Facebook", "Pinterest"],
    monthlyTraffic: 2250000,
    primaryAudience: {
      ageRange: "25-40",
      gender: "Mixed",
      interests: ["Parenting", "Child Care", "Education"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "hello@parentingmadeeasy.au",
    website: "https://parentingmadeeasy.au",
    joinedDate: "2020-03-22",
    lastActive: "2024-06-18",
    socialMedia: {
      facebook: "https://facebook.com/parentingmadeeasy",
      instagram: "https://instagram.com/parentingmadeeasy",
      youtube: "https://youtube.com/parentingmadeeasy"
    },
    performance: {
      totalClicks: 1575000,
      totalConversions: 67725,
      totalRevenue: 132000,
      averageOrderValue: 195
    },
    topCategories: [
      { category: "Baby Products", percentage: 45 },
      { category: "Educational Toys", percentage: 30 },
      { category: "Books", percentage: 25 }
    ]
  },
  {
    id: "16",
    name: "Crypto & Finance Hub",
    logo: "/placeholder.svg",
    description: "Cryptocurrency news, trading guides, and financial technology product reviews.",
    categories: ["Finance", "Technology", "Investment"],
    country: "United States",
    averageEPC: 4.23,
    conversionRate: 2.1,
    rating: 4.3,
    reviewCount: 198,
    isVerified: true,
    tags: ["Cryptocurrency", "Trading", "FinTech"],
    trafficSources: ["YouTube", "Newsletter", "Social Media"],
    monthlyTraffic: 1950000,
    primaryAudience: {
      ageRange: "22-45",
      gender: "Mixed",
      interests: ["Cryptocurrency", "Trading", "Finance"]
    },
    payoutModels: ["CPC", "CPA"],
    contactEmail: "partnerships@cryptofinancehub.com",
    website: "https://cryptofinancehub.com",
    joinedDate: "2021-01-18",
    lastActive: "2024-06-17",
    socialMedia: {
      youtube: "https://youtube.com/cryptofinancehub",
      twitter: "https://twitter.com/cryptofinancehub"
    },
    performance: {
      totalClicks: 1365000,
      totalConversions: 28665,
      totalRevenue: 121200,
      averageOrderValue: 423
    },
    topCategories: [
      { category: "Trading Tools", percentage: 50 },
      { category: "Hardware Wallets", percentage: 30 },
      { category: "Education", percentage: 20 }
    ]
  },
  {
    id: "17",
    name: "Sustainable Living Blog",
    logo: "/placeholder.svg",
    description: "Eco-friendly lifestyle tips, sustainable product reviews, and environmental awareness.",
    categories: ["Lifestyle", "Environment", "Health"],
    country: "Denmark",
    averageEPC: 1.78,
    conversionRate: 4.8,
    rating: 4.9,
    reviewCount: 156,
    isVerified: true,
    tags: ["Sustainability", "Eco-Friendly", "Environment"],
    trafficSources: ["Blog", "Instagram", "Pinterest"],
    monthlyTraffic: 1320000,
    primaryAudience: {
      ageRange: "25-50",
      gender: "Mixed",
      interests: ["Environment", "Sustainability", "Health"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "hello@sustainableliving.dk",
    website: "https://sustainableliving.dk",
    joinedDate: "2022-04-03",
    lastActive: "2024-06-18",
    socialMedia: {
      instagram: "https://instagram.com/sustainableliving",
      pinterest: "https://pinterest.com/sustainableliving"
    },
    performance: {
      totalClicks: 792000,
      totalConversions: 38016,
      totalRevenue: 67700,
      averageOrderValue: 178
    },
    topCategories: [
      { category: "Eco Products", percentage: 55 },
      { category: "Renewable Energy", percentage: 25 },
      { category: "Organic Food", percentage: 20 }
    ]
  },
  {
    id: "18",
    name: "Music Production Studio",
    logo: "/placeholder.svg",
    description: "Music production tutorials, gear reviews, and software recommendations for producers.",
    categories: ["Music", "Technology", "Education"],
    country: "United Kingdom",
    averageEPC: 2.56,
    conversionRate: 3.4,
    rating: 4.5,
    reviewCount: 134,
    isVerified: false,
    tags: ["Music Production", "Audio Gear", "Education"],
    trafficSources: ["YouTube", "SoundCloud", "Blog"],
    monthlyTraffic: 1280000,
    primaryAudience: {
      ageRange: "18-40",
      gender: "Mixed",
      interests: ["Music", "Audio Production", "Technology"]
    },
    payoutModels: ["CPC", "CPA", "Revenue Share"],
    contactEmail: "contact@musicproductionstudio.uk",
    website: "https://musicproductionstudio.uk",
    joinedDate: "2021-08-14",
    lastActive: "2024-06-16",
    socialMedia: {
      youtube: "https://youtube.com/musicproductionstudio",
      soundcloud: "https://soundcloud.com/musicproductionstudio"
    },
    performance: {
      totalClicks: 768000,
      totalConversions: 26112,
      totalRevenue: 66800,
      averageOrderValue: 256
    },
    topCategories: [
      { category: "Audio Equipment", percentage: 60 },
      { category: "Software", percentage: 25 },
      { category: "Instruments", percentage: 15 }
    ]
  },
  {
    id: "19",
    name: "Language Learning Corner",
    logo: "/placeholder.svg",
    description: "Language learning resources, app reviews, and cultural content for polyglots.",
    categories: ["Education", "Language", "Culture"],
    country: "Spain",
    averageEPC: 1.65,
    conversionRate: 5.1,
    rating: 4.8,
    reviewCount: 178,
    isVerified: true,
    tags: ["Language Learning", "Education", "Culture"],
    trafficSources: ["YouTube",  "App", "Blog"],
    monthlyTraffic: 1680000,
    primaryAudience: {
      ageRange: "16-45",
      gender: "Mixed",
      interests: ["Languages", "Culture", "Travel"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "hola@languagelearningcorner.es",
    website: "https://languagelearningcorner.es",
    joinedDate: "2020-10-07",
    lastActive: "2024-06-17",
    socialMedia: {
      youtube: "https://youtube.com/languagelearningcorner",
      instagram: "https://instagram.com/languagelearningcorner"
    },
    performance: {
      totalClicks: 1176000,
      totalConversions: 59976,
      totalRevenue: 99000,
      averageOrderValue: 165
    },
    topCategories: [
      { category: "Language Apps", percentage: 50 },
      { category: "Books", percentage: 30 },
      { category: "Online Courses", percentage: 20 }
    ]
  },
  {
    id: "20",
    name: "Book Lover's Paradise",
    logo: "/placeholder.svg",
    description: "Book reviews, reading recommendations, and literary discussion for book enthusiasts.",
    categories: ["Books", "Education", "Entertainment"],
    country: "Canada",
    averageEPC: 1.43,
    conversionRate: 4.6,
    rating: 4.9,
    reviewCount: 223,
    isVerified: true,
    tags: ["Books", "Literature", "Reading"],
    trafficSources: ["Blog", "Goodreads", "Social Media"],
    monthlyTraffic: 1580000,
    primaryAudience: {
      ageRange: "25-60",
      gender: "Mixed",
      interests: ["Reading", "Literature", "Writing"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "hello@bookloversparadise.ca",
    website: "https://bookloversparadise.ca",
    joinedDate: "2020-07-19",
    lastActive: "2024-06-18",
    socialMedia: {
      instagram: "https://instagram.com/bookloversparadise",
      goodreads: "https://goodreads.com/bookloversparadise"
    },
    performance: {
      totalClicks: 1106000,
      totalConversions: 50876,
      totalRevenue: 72800,
      averageOrderValue: 143
    },
    topCategories: [
      { category: "Books", percentage: 70 },
      { category: "E-readers", percentage: 20 },
      { category: "Book Accessories", percentage: 10 }
    ]
  },
  {
    id: "21",
    name: "Craft & DIY Central",
    logo: "/placeholder.svg",
    description: "Creative crafting tutorials, DIY project guides, and art supply recommendations.",
    categories: ["Crafts", "DIY", "Art"],
    country: "United States",
    averageEPC: 2.08,
    conversionRate: 4.4,
    rating: 4.6,
    reviewCount: 195,
    isVerified: false,
    tags: ["Crafting", "DIY", "Art Supplies"],
    trafficSources: ["Pinterest", "YouTube", "Blog"],
    monthlyTraffic: 1890000,
    primaryAudience: {
      ageRange: "25-55",
      gender: "Mixed",
      interests: ["Crafting", "DIY", "Art"]
    },
    payoutModels: ["CPC", "CPA", "Revenue Share"],
    contactEmail: "contact@craftdiycentral.com",
    website: "https://craftdiycentral.com",
    joinedDate: "2021-03-28",
    lastActive: "2024-06-17",
    socialMedia: {
      pinterest: "https://pinterest.com/craftdiycentral",
      youtube: "https://youtube.com/craftdiycentral",
      instagram: "https://instagram.com/craftdiycentral"
    },
    performance: {
      totalClicks: 1323000,
      totalConversions: 58212,
      totalRevenue: 121000,
      averageOrderValue: 208
    },
    topCategories: [
      { category: "Craft Supplies", percentage: 60 },
      { category: "Tools", percentage: 25 },
      { category: "Kits", percentage: 15 }
    ]
  },
  {
    id: "22",
    name: "Productivity Hacks Pro",
    logo: "/placeholder.svg",
    description: "Productivity tips, time management strategies, and workflow optimization tools.",
    categories: ["Productivity", "Business", "Technology"],
    country: "Singapore",
    averageEPC: 2.78,
    conversionRate: 3.9,
    rating: 4.7,
    reviewCount: 167,
    isVerified: true,
    tags: ["Productivity", "Business", "Optimization"],
    trafficSources: ["Blog", "LinkedIn", "Newsletter"],
    monthlyTraffic: 1420000,
    primaryAudience: {
      ageRange: "24-50",
      gender: "Mixed",
      interests: ["Productivity", "Business", "Self-improvement"]
    },
    payoutModels: ["CPC", "CPA"],
    contactEmail: "partnerships@productivityhackspro.sg",
    website: "https://productivityhackspro.sg",
    joinedDate: "2021-11-12",
    lastActive: "2024-06-18",
    socialMedia: {
      linkedin: "https://linkedin.com/company/productivityhackspro",
      twitter: "https://twitter.com/productivitypro"
    },
    performance: {
      totalClicks: 994000,
      totalConversions: 38766,
      totalRevenue: 107800,
      averageOrderValue: 278
    },
    topCategories: [
      { category: "Software Tools", percentage: 50 },
      { category: "Books", percentage: 30 },
      { category: "Courses", percentage: 20 }
    ]
  },
  {
    id: "23",
    name: "Senior Living Guide",
    logo: "/placeholder.svg",
    description: "Resources and product recommendations for seniors and their families.",
    categories: ["Health", "Senior Living", "Family"],
    country: "United States",
    averageEPC: 2.45,
    conversionRate: 3.2,
    rating: 4.8,
    reviewCount: 145,
    isVerified: true,
    tags: ["Senior Care", "Health", "Family"],
    trafficSources: ["Blog", "Facebook", "Newsletter"],
    monthlyTraffic: 1680000,
    primaryAudience: {
      ageRange: "45-75",
      gender: "Mixed",
      interests: ["Health", "Senior Care", "Family"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "info@seniorlivingguide.com",
    website: "https://seniorlivingguide.com",
    joinedDate: "2020-12-05",
    lastActive: "2024-06-17",
    socialMedia: {
      facebook: "https://facebook.com/seniorlivingguide",
      youtube: "https://youtube.com/seniorlivingguide"
    },
    performance: {
      totalClicks: 1176000,
      totalConversions: 37632,
      totalRevenue: 92200,
      averageOrderValue: 245
    },
    topCategories: [
      { category: "Health Products", percentage: 45 },
      { category: "Mobility Aids", percentage: 30 },
      { category: "Technology", percentage: 25 }
    ]
  },
  {
    id: "24",
    name: "Sports Performance Lab",
    logo: "/placeholder.svg",
    description: "Athletic performance optimization, sports nutrition, and training equipment reviews.",
    categories: ["Sports", "Fitness", "Health"],
    country: "Germany",
    averageEPC: 3.34,
    conversionRate: 2.7,
    rating: 4.5,
    reviewCount: 189,
    isVerified: true,
    tags: ["Sports Performance", "Athletics", "Training"],
    trafficSources: ["YouTube", "Blog", "App"],
    monthlyTraffic: 1750000,
    primaryAudience: {
      ageRange: "18-45",
      gender: "Mixed",
      interests: ["Sports", "Training", "Performance"]
    },
    payoutModels: ["CPC", "CPA", "Revenue Share"],
    contactEmail: "partnerships@sportsperformancelab.de",
    website: "https://sportsperformancelab.de",
    joinedDate: "2021-05-16",
    lastActive: "2024-06-18",
    socialMedia: {
      youtube: "https://youtube.com/sportsperformancelab",
      instagram: "https://instagram.com/sportsperformancelab"
    },
    performance: {
      totalClicks: 1225000,
      totalConversions: 33075,
      totalRevenue: 110500,
      averageOrderValue: 334
    },
    topCategories: [
      { category: "Supplements", percentage: 40 },
      { category: "Equipment", percentage: 35 },
      { category: "Apparel", percentage: 25 }
    ]
  },
  {
    id: "25",
    name: "Career Development Hub",
    logo: "/placeholder.svg",
    description: "Career advice, job search strategies, and professional development resources.",
    categories: ["Career", "Business", "Education"],
    country: "Canada",
    averageEPC: 2.12,
    conversionRate: 4.1,
    rating: 4.6,
    reviewCount: 178,
    isVerified: false,
    tags: ["Career Development", "Professional Growth", "Education"],
    trafficSources: ["LinkedIn", "Blog", "Podcast"],
    monthlyTraffic: 1450000,
    primaryAudience: {
      ageRange: "22-50",
      gender: "Mixed",
      interests: ["Career", "Professional Development", "Business"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "hello@careerdevelopmenthub.ca",
    website: "https://careerdevelopmenthub.ca",
    joinedDate: "2022-01-25",
    lastActive: "2024-06-16",
    socialMedia: {
      linkedin: "https://linkedin.com/company/careerdevelopmenthub",
      twitter: "https://twitter.com/careerhub"
    },
    performance: {
      totalClicks: 1015000,
      totalConversions: 41615,
      totalRevenue: 88300,
      averageOrderValue: 212
    },
    topCategories: [
      { category: "Courses", percentage: 50 },
      { category: "Books", percentage: 30 },
      { category: "Software", percentage: 20 }
    ]
  },
  {
    id: "26",
    name: "Wedding Planning Expert",
    logo: "/placeholder.svg",
    description: "Wedding planning advice, vendor recommendations, and bridal product reviews.",
    categories: ["Wedding", "Events", "Lifestyle"],
    country: "Italy",
    averageEPC: 2.89,
    conversionRate: 3.8,
    rating: 4.9,
    reviewCount: 234,
    isVerified: true,
    tags: ["Wedding Planning", "Events", "Bridal"],
    trafficSources: ["Pinterest", "Instagram", "Blog"],
    monthlyTraffic: 1620000,
    primaryAudience: {
      ageRange: "22-35",
      gender: "Mixed",
      interests: ["Weddings", "Events", "Fashion"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "ciao@weddingplanningexpert.it",
    website: "https://weddingplanningexpert.it",
    joinedDate: "2021-02-14",
    lastActive: "2024-06-18",
    socialMedia: {
      pinterest: "https://pinterest.com/weddingplanningexpert",
      instagram: "https://instagram.com/weddingplanningexpert"
    },
    performance: {
      totalClicks: 1134000,
      totalConversions: 43092,
      totalRevenue: 124600,
      averageOrderValue: 289
    },
    topCategories: [
      { category: "Wedding Dresses", percentage: 40 },
      { category: "Decorations", percentage: 35 },
      { category: "Services", percentage: 25 }
    ]
  },
  {
    id: "27",
    name: "Student Life Essentials",
    logo: "/placeholder.svg",
    description: "College and university student resources, study tips, and budget-friendly recommendations.",
    categories: ["Education", "Student Life", "Budget"],
    country: "United Kingdom",
    averageEPC: 1.34,
    conversionRate: 5.2,
    rating: 4.4,
    reviewCount: 267,
    isVerified: false,
    tags: ["Student Life", "Budget", "Education"],
    trafficSources: ["TikTok", "Instagram", "Blog"],
    monthlyTraffic: 2100000,
    primaryAudience: {
      ageRange: "16-25",
      gender: "Mixed",
      interests: ["Education", "Student Life", "Budget Shopping"]
    },
    payoutModels: ["CPC", "CPA"],
    contactEmail: "hello@studentlifeessentials.uk",
    website: "https://studentlifeessentials.uk",
    joinedDate: "2022-09-01",
    lastActive: "2024-06-17",
    socialMedia: {
      tiktok: "https://tiktok.com/@studentlifeessentials",
      instagram: "https://instagram.com/studentlifeessentials"
    },
    performance: {
      totalClicks: 1470000,
      totalConversions: 76440,
      totalRevenue: 102400,
      averageOrderValue: 134
    },
    topCategories: [
      { category: "Study Supplies", percentage: 45 },
      { category: "Technology", percentage: 30 },
      { category: "Lifestyle", percentage: 25 }
    ]
  },
  {
    id: "28",
    name: "Real Estate Investor Pro",
    logo: "/placeholder.svg",
    description: "Real estate investment strategies, market analysis, and property management tools.",
    categories: ["Real Estate", "Investment", "Finance"],
    country: "United States",
    averageEPC: 4.56,
    conversionRate: 1.8,
    rating: 4.7,
    reviewCount: 156,
    isVerified: true,
    tags: ["Real Estate", "Investment", "High Value"],
    trafficSources: ["YouTube", "Podcast", "Newsletter"],
    monthlyTraffic: 1380000,
    primaryAudience: {
      ageRange: "28-60",
      gender: "Mixed",
      interests: ["Real Estate", "Investment", "Finance"]
    },
    payoutModels: ["CPC", "CPA"],
    contactEmail: "partnerships@realestateninvestorpro.com",
    website: "https://realestateinvestorpro.com",
    joinedDate: "2020-06-12",
    lastActive: "2024-06-18",
    socialMedia: {
      youtube: "https://youtube.com/realestateinvestorpro",
      linkedin: "https://linkedin.com/company/realestateinvestorpro"
    },
    performance: {
      totalClicks: 966200,
      totalConversions: 17392,
      totalRevenue: 79300,
      averageOrderValue: 456
    },
    topCategories: [
      { category: "Software Tools", percentage: 50 },
      { category: "Education", percentage: 30 },
      { category: "Services", percentage: 20 }
    ]
  },
  {
    id: "29",
    name: "Mental Health Advocate",
    logo: "/placeholder.svg",
    description: "Mental health awareness, therapy resources, and wellness product recommendations.",
    categories: ["Health", "Mental Health", "Wellness"],
    country: "Australia",
    averageEPC: 1.87,
    conversionRate: 4.5,
    rating: 4.9,
    reviewCount: 298,
    isVerified: true,
    tags: ["Mental Health", "Wellness", "Advocacy"],
    trafficSources: ["Blog", "Podcast", "Social Media"],
    monthlyTraffic: 1750000,
    primaryAudience: {
      ageRange: "18-50",
      gender: "Mixed",
      interests: ["Mental Health", "Wellness", "Self-care"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "hello@mentalhealthadvocate.au",
    website: "https://mentalhealthadvocate.au",
    joinedDate: "2020-05-10",
    lastActive: "2024-06-18",
    socialMedia: {
      instagram: "https://instagram.com/mentalhealthadvocate",
      twitter: "https://twitter.com/mentalhealthadv"
    },
    performance: {
      totalClicks: 1225000,
      totalConversions: 55125,
      totalRevenue: 103100,
      averageOrderValue: 187
    },
    topCategories: [
      { category: "Books", percentage: 40 },
      { category: "Apps", percentage: 35 },
      { category: "Therapy Tools", percentage: 25 }
    ]
  },
  {
    id: "30",
    name: "Minimalist Living Guide",
    logo: "/placeholder.svg",
    description: "Minimalist lifestyle advice, decluttering tips, and sustainable living recommendations.",
    categories: ["Lifestyle", "Minimalism", "Sustainability"],
    country: "Japan",
    averageEPC: 1.68,
    conversionRate: 4.7,
    rating: 4.8,
    reviewCount: 187,
    isVerified: true,
    tags: ["Minimalism", "Lifestyle", "Sustainability"],
    trafficSources: ["Blog", "YouTube", "Instagram"],
    monthlyTraffic: 1480000,
    primaryAudience: {
      ageRange: "25-45",
      gender: "Mixed",
      interests: ["Minimalism", "Sustainability", "Lifestyle"]
    },
    payoutModels: ["CPA", "Revenue Share"],
    contactEmail: "hello@minimalistlivingguide.jp",
    website: "https://minimalistlivingguide.jp",
    joinedDate: "2021-10-08",
    lastActive: "2024-06-17",
    socialMedia: {
      youtube: "https://youtube.com/minimalistlivingguide",
      instagram: "https://instagram.com/minimalistlivingguide"
    },
    performance: {
      totalClicks: 1036000,
      totalConversions: 48692,
      totalRevenue: 81800,
      averageOrderValue: 168
    },
    topCategories: [
      { category: "Home Organization", percentage: 50 },
      { category: "Sustainable Products", percentage: 30 },
      { category: "Books", percentage: 20 }
    ]
  }
];
