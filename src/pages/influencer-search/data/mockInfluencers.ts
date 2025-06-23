
import { Influencer } from '../types/influencer';

export const mockInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Lihi Bracha',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d7c7?w=150&h=150&fit=crop&crop=center',
    bio: 'Playful TikTok Creator Sharing Humorous Moments',
    location: 'Israel',
    language: 'Hebrew',
    category: 'Outfits & Styling',
    industries: ['Lifestyle', 'Fashion'],
    influenceScore: 4,
    totalPoints: 7312,
    lastUpdated: 'a few seconds ago',
    profileOverview: 'Lihi Bracha is a 23-year-old TikTok creator known for her humorous and engaging content, often featuring her small dog and playful interactions with friends. Her posts include lighthearted commentary and relatable moments, showcasing her vibrant personality. With a significant number of likes on her videos, she has built a strong presence on the platform, appealing to a youthful audience.',
    quote: '"16 נא לא 23 נא"',
    socialMediaProfiles: [
      {
        platform: 'TikTok',
        handle: '@lihibracha5',
        followers: 39200,
        score: 76.7,
        engagementRate: 2.28,
        growth: 0
      }
    ],
    campaignRipeness: {
      priceRange: '$500 - $1.3K / post',
      audienceTarget: 'Hebrew-speaking young adults, primarily in Israel, with a strong presence on TikTok.',
      engagementDescription: 'High engagement with a youthful audience through relatable and humorous content.',
      brandSuitability: 'Best suited for brands in lifestyle, pet products, and youth-oriented markets.',
      partnershipLikelihood: 'Likely to accept brand partnerships, especially for sponsored posts and product reviews on TikTok.'
    },
    contentStyle: {
      type: 'Casual',
      brandSafety: 'Very safe',
      engagement: 'Very good'
    },
    isVerified: true,
    tags: ['Comedy', 'Lifestyle', 'TikTok', 'Youth']
  },
  {
    id: '2',
    name: 'Chris Winterhoff',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=center',
    bio: 'Growth Consultant Specializing in Paid Acquisition Strategies',
    location: 'United Kingdom',
    language: 'English',
    category: 'LinkedIn Growth',
    industries: ['B2B', 'Marketing', 'Business'],
    influenceScore: 10,
    totalPoints: 405,
    lastUpdated: '6 days ago',
    profileOverview: 'Chris Winterhoff is a growth consultant specializing in paid acquisition strategies for startups. He shares insights on marketing effectiveness, customer behavior, and the challenges faced by DTC companies. His posts often critique industry giants and emphasize the importance of differentiation and understanding customer needs. With a focus on practical advice, he engages with a community of entrepreneurs and marketers.',
    quote: '"Growth is so much easier when customers instantly get that your business is different."',
    socialMediaProfiles: [
      {
        platform: 'LinkedIn',
        handle: '@chris-winterhoff',
        followers: 3300,
        score: 17,
        engagementRate: 5.2,
        growth: 0.52
      }
    ],
    campaignRipeness: {
      priceRange: '$100 / post',
      audienceTarget: 'English-speaking entrepreneurs and marketers, primarily in the UK, with a strong presence on LinkedIn.',
      engagementDescription: 'High engagement with a niche audience focused on startup growth and marketing.',
      brandSuitability: 'Best suited for partnerships with tech startups, marketing agencies, and B2B brands.',
      partnershipLikelihood: 'Likely to accept brand partnerships that align with his expertise, particularly through sponsored posts and strategy consultations.'
    },
    contentStyle: {
      type: 'Analytical',
      brandSafety: 'Safe',
      engagement: 'Very good'
    },
    isVerified: false,
    tags: ['B2B', 'Growth', 'Marketing', 'Startups']
  },
  {
    id: '3',
    name: 'Zu Bair',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=center',
    bio: 'Lifestyle Enthusiast Sharing Moments',
    location: 'United States',
    language: 'English',
    category: 'Lifestyle & Reality TV',
    industries: ['Entertainment', 'Lifestyle'],
    influenceScore: 7,
    totalPoints: 4818,
    lastUpdated: '2 days ago',
    profileOverview: 'Zu Bair, known for sharing lifestyle moments on TikTok under the username Zubair❤️❤️❤️. Follow for a glimpse into daily life and entertainment content.',
    socialMediaProfiles: [
      {
        platform: 'TikTok',
        handle: '@zubair',
        followers: 42000,
        score: 42,
        engagementRate: 3.1,
        growth: -0.32
      }
    ],
    campaignRipeness: {
      priceRange: '$300 - $800 / post',
      audienceTarget: 'English-speaking lifestyle enthusiasts, primarily in the US.',
      engagementDescription: 'Moderate engagement with lifestyle-focused content.',
      brandSuitability: 'Suitable for lifestyle brands, entertainment, and consumer products.',
      partnershipLikelihood: 'Open to brand partnerships for lifestyle and entertainment brands.'
    },
    contentStyle: {
      type: 'Casual',
      brandSafety: 'Safe',
      engagement: 'Good'
    },
    isVerified: true,
    tags: ['Lifestyle', 'Entertainment', 'Daily Life']
  },
  {
    id: '4',
    name: 'Peter Frampton',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=center',
    bio: 'Peter Frampton on MV - Music Vault',
    location: 'United Kingdom',
    language: 'English',
    category: 'Rock Bands & Guitarists',
    industries: ['Music', 'Entertainment'],
    influenceScore: 10,
    totalPoints: 2200,
    lastUpdated: '1 day ago',
    profileOverview: 'Peter Frampton on MV is a sub channel of Music Vault, offering a collection of live Frampton videos. The channel showcases classic rock performances and guitar mastery.',
    socialMediaProfiles: [
      {
        platform: 'YouTube',
        handle: '@PeterFramptonMV',
        followers: 19000,
        score: 19,
        engagementRate: 4.5,
        growth: 0.65
      }
    ],
    campaignRipeness: {
      priceRange: '$200 - $500 / post',
      audienceTarget: 'Rock music fans and guitar enthusiasts, primarily English-speaking.',
      engagementDescription: 'High engagement among music lovers and guitar players.',
      brandSuitability: 'Perfect for music equipment brands, guitar manufacturers, and music-related products.',
      partnershipLikelihood: 'Likely to partner with music industry brands and equipment manufacturers.'
    },
    contentStyle: {
      type: 'Professional',
      brandSafety: 'Very safe',
      engagement: 'Very good'
    },
    isVerified: true,
    tags: ['Music', 'Rock', 'Guitar', 'Live Performance']
  },
  {
    id: '5',
    name: 'Dr. Abhishek',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=center',
    bio: 'Global HR Leader and DEI Advisor',
    location: 'India',
    language: 'English',
    category: 'HR Industry',
    industries: ['Human Resources', 'Business', 'Education'],
    influenceScore: 9,
    totalPoints: 1636,
    lastUpdated: '3 days ago',
    profileOverview: 'Dr. Abhishek is a global HR leader and DEI (Diversity, Equity, and Inclusion) advisor with extensive experience in human resources management and organizational development.',
    socialMediaProfiles: [
      {
        platform: 'LinkedIn',
        handle: '@dr-abhishek-hr',
        followers: 41000,
        score: 41,
        engagementRate: 6.2,
        growth: 1.34
      }
    ],
    campaignRipeness: {
      priceRange: '$150 - $400 / post',
      audienceTarget: 'HR professionals, business leaders, and DEI advocates globally.',
      engagementDescription: 'Strong engagement within HR and business communities.',
      brandSuitability: 'Ideal for HR tech companies, business consulting firms, and educational platforms.',
      partnershipLikelihood: 'Open to partnerships with professional development and HR technology brands.'
    },
    contentStyle: {
      type: 'Professional',
      brandSafety: 'Very safe',
      engagement: 'Very good'
    },
    isVerified: false,
    tags: ['HR', 'Leadership', 'DEI', 'Business']
  },
  {
    id: '6',
    name: 'Brittany',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=center',
    bio: 'Lifestyle Enthusiast and Artist',
    location: 'United States',
    language: 'English',
    category: 'Photography & Videography',
    industries: ['Photography', 'Art', 'Lifestyle'],
    influenceScore: 8,
    totalPoints: 2650,
    lastUpdated: '4 hours ago',
    profileOverview: 'Brittany is a lifestyle enthusiast and artist specializing in photography and videography. She creates content around creative processes and artistic inspiration.',
    socialMediaProfiles: [
      {
        platform: 'Instagram',
        handle: '@brittany_creates',
        followers: 35000,
        score: 35,
        engagementRate: 4.8,
        growth: -0.11
      }
    ],
    campaignRipeness: {
      priceRange: '$400 - $900 / post',
      audienceTarget: 'Creative professionals, photographers, and lifestyle enthusiasts.',
      engagementDescription: 'High engagement with creative and artistic content.',
      brandSuitability: 'Perfect for camera brands, art supplies, and creative software.',
      partnershipLikelihood: 'Very likely to partner with creative brands and photography equipment companies.'
    },
    contentStyle: {
      type: 'Creative',
      brandSafety: 'Very safe',
      engagement: 'Very good'
    },
    isVerified: true,
    tags: ['Photography', 'Art', 'Creative', 'Visual Content']
  },
  {
    id: '7',
    name: 'Sofia Martinez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=center',
    bio: 'Fitness & Wellness Coach Inspiring Healthy Living',
    location: 'Spain',
    language: 'Spanish',
    category: 'Fitness & Health',
    industries: ['Health', 'Fitness', 'Wellness'],
    influenceScore: 9,
    totalPoints: 15600,
    lastUpdated: '12 hours ago',
    profileOverview: 'Sofia Martinez is a certified fitness trainer and wellness coach who shares workout routines, healthy recipes, and motivational content. Her authentic approach to fitness makes her relatable to beginners and fitness enthusiasts alike.',
    quote: '"Tu cuerpo puede hacerlo. Es tu mente la que tienes que convencer."',
    socialMediaProfiles: [
      {
        platform: 'Instagram',
        handle: '@sofia_fitness_life',
        followers: 87500,
        score: 82,
        engagementRate: 7.3,
        growth: 2.1
      }
    ],
    campaignRipeness: {
      priceRange: '$800 - $2K / post',
      audienceTarget: 'Spanish-speaking fitness enthusiasts, primarily women aged 25-40.',
      engagementDescription: 'Very high engagement with fitness and wellness content, strong community interaction.',
      brandSuitability: 'Perfect for fitness brands, supplement companies, activewear, and wellness products.',
      partnershipLikelihood: 'Very likely to partner with health and fitness brands, especially those promoting body positivity.'
    },
    contentStyle: {
      type: 'Motivational',
      brandSafety: 'Very safe',
      engagement: 'Very good'
    },
    isVerified: true,
    tags: ['Fitness', 'Wellness', 'Motivation', 'Health']
  },
  {
    id: '8',
    name: 'Jake Thompson',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=center',
    bio: 'Tech Reviewer & Gaming Enthusiast',
    location: 'Canada',
    language: 'English',
    category: 'Gaming & Technology',
    industries: ['Technology', 'Gaming', 'Electronics'],
    influenceScore: 8,
    totalPoints: 12400,
    lastUpdated: '6 hours ago',
    profileOverview: 'Jake Thompson creates in-depth tech reviews, gaming content, and tutorials. Known for his honest opinions and detailed analysis of the latest gadgets and games.',
    quote: '"Technology should make life easier, not more complicated."',
    socialMediaProfiles: [
      {
        platform: 'YouTube',
        handle: '@JakeTechReviews',
        followers: 156000,
        score: 78,
        engagementRate: 5.8,
        growth: 1.7
      }
    ],
    campaignRipeness: {
      priceRange: '$1K - $3K / post',
      audienceTarget: 'Tech enthusiasts and gamers, primarily males aged 18-35.',
      engagementDescription: 'High engagement with tech-savvy audience, strong influence on purchasing decisions.',
      brandSuitability: 'Ideal for tech companies, gaming brands, electronics manufacturers.',
      partnershipLikelihood: 'Very open to tech partnerships, especially for product reviews and launches.'
    },
    contentStyle: {
      type: 'Educational',
      brandSafety: 'Very safe',
      engagement: 'Very good'
    },
    isVerified: true,
    tags: ['Tech', 'Gaming', 'Reviews', 'Electronics']
  },
  {
    id: '9',
    name: 'Emma Chen',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=center',
    bio: 'Food Blogger & Recipe Developer',
    location: 'Singapore',
    language: 'English',
    category: 'Food & Cooking',
    industries: ['Food', 'Cooking', 'Lifestyle'],
    influenceScore: 7,
    totalPoints: 9800,
    lastUpdated: '1 day ago',
    profileOverview: 'Emma Chen is a passionate food blogger who creates easy-to-follow recipes and food photography tips. She specializes in Asian fusion cuisine and healthy meal prep ideas.',
    quote: '"Good food is the foundation of genuine happiness."',
    socialMediaProfiles: [
      {
        platform: 'Instagram',
        handle: '@emmacookstogether',
        followers: 64200,
        score: 71,
        engagementRate: 6.4,
        growth: 1.2
      }
    ],
    campaignRipeness: {
      priceRange: '$600 - $1.5K / post',
      audienceTarget: 'Food enthusiasts and home cooks, diverse age range with focus on health-conscious individuals.',
      engagementDescription: 'Strong engagement with recipe posts and cooking tutorials.',
      brandSuitability: 'Perfect for kitchen appliance brands, food products, cooking ingredients.',
      partnershipLikelihood: 'Open to food brand partnerships and kitchen equipment collaborations.'
    },
    contentStyle: {
      type: 'Educational',
      brandSafety: 'Very safe',
      engagement: 'Very good'
    },
    isVerified: false,
    tags: ['Food', 'Cooking', 'Recipes', 'Asian Cuisine']
  },
  {
    id: '10',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=center',
    bio: 'Travel Photographer & Adventure Seeker',
    location: 'United States',
    language: 'English',
    category: 'Travel & Adventure',
    industries: ['Travel', 'Photography', 'Adventure'],
    influenceScore: 9,
    totalPoints: 18200,
    lastUpdated: '8 hours ago',
    profileOverview: 'Marcus Johnson captures stunning landscapes and shares travel tips from around the world. His content inspires wanderlust and provides practical advice for fellow travelers.',
    quote: '"The world is a book, and those who do not travel read only one page."',
    socialMediaProfiles: [
      {
        platform: 'Instagram',
        handle: '@marcuswanderlust',
        followers: 124000,
        score: 85,
        engagementRate: 8.1,
        growth: 2.8
      }
    ],
    campaignRipeness: {
      priceRange: '$1.2K - $3.5K / post',
      audienceTarget: 'Travel enthusiasts, adventure seekers, and photography lovers aged 25-45.',
      engagementDescription: 'Exceptional engagement with travel content, high influence on travel decisions.',
      brandSuitability: 'Ideal for travel brands, camera equipment, outdoor gear, and tourism boards.',
      partnershipLikelihood: 'Very eager to partner with travel and outdoor brands.'
    },
    contentStyle: {
      type: 'Inspirational',
      brandSafety: 'Very safe',
      engagement: 'Very good'
    },
    isVerified: true,
    tags: ['Travel', 'Photography', 'Adventure', 'Landscape']
  }
];
