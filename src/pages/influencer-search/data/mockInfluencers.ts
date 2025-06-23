
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
  }
];
