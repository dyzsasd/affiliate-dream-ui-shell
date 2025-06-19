
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdvertiserSearch from './components/AdvertiserSearch';
import PartnersModal from './components/PartnersModal';

// Mock advertisers data for search
const mockAdvertisers = [
  { id: 1, domain: "anker.com", name: "Anker", logo: "A" },
  { id: 2, domain: "apple.com", name: "Apple", logo: "A" },
  { id: 3, domain: "amazon.com", name: "Amazon", logo: "A" },
  { id: 4, domain: "microsoft.com", name: "Microsoft", logo: "M" },
  { id: 5, domain: "google.com", name: "Google", logo: "G" },
  { id: 6, domain: "facebook.com", name: "Meta", logo: "M" },
  { id: 7, domain: "netflix.com", name: "Netflix", logo: "N" },
  { id: 8, domain: "spotify.com", name: "Spotify", logo: "S" },
  { id: 9, domain: "adobe.com", name: "Adobe", logo: "A" },
  { id: 10, domain: "salesforce.com", name: "Salesforce", logo: "S" },
  { id: 11, domain: "airbnb.com", name: "Airbnb", logo: "A" },
  { id: 12, domain: "uber.com", name: "Uber", logo: "U" }
];

// Mock partners data
const mockPartners = [
  { id: 1, name: "TechReview Pro", type: "blog", joinDate: "2024-01-15", performance: "high" },
  { id: 2, name: "Student Deals Hub", type: "student", joinDate: "2024-02-20", performance: "medium" },
  { id: 3, name: "Cashback Central", type: "incentive", joinDate: "2024-03-10", performance: "high" },
  { id: 4, name: "Digital Marketing Blog", type: "blog", joinDate: "2024-01-25", performance: "medium" },
  { id: 5, name: "University Network", type: "student", joinDate: "2024-02-15", performance: "high" },
  { id: 6, name: "Tech Forum Community", type: "forum", joinDate: "2024-03-05", performance: "low" },
  { id: 7, name: "Content Creator Hub", type: "content", joinDate: "2024-02-28", performance: "medium" },
  { id: 8, name: "Campus Deals", type: "student", joinDate: "2024-01-30", performance: "high" },
  { id: 9, name: "Reward Portal", type: "incentive", joinDate: "2024-03-12", performance: "medium" },
  { id: 10, name: "Tech News Daily", type: "blog", joinDate: "2024-02-10", performance: "high" }
];

// Mock data based on the provided JSON
const mockData = {
  advertiser: {
    domain: "anker.com",
    partnerInformation: {
      partners: { count: 1379 },
      partnersAdded: { count: 153 },
      partnersRemoved: { count: 133 },
      promotypeMix: {
        value: [
          { promotype: "student", count: 103 },
          { promotype: "blog", count: 308 },
          { promotype: "incentive", count: 46 },
          { promotype: "content", count: 31 },
          { promotype: "forum", count: 6 }
        ]
      }
    },
    affiliateNetworks: {
      sampleValue: ["Admitad", "Avantlink", "Awin"]
    },
    keywords: {
      count: 0,
      value: []
    },
    verticals: {
      sampleValue: {
        name: "Technology / Electronics",
        rank: 2,
        score: 95
      }
    }
  }
};

const COLORS = {
  student: '#ef4444',
  blog: '#f97316',
  incentive: '#eab308',
  content: '#8b5cf6',
  forum: '#10b981'
};

const AdvertiserAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const [selectedAdvertiser, setSelectedAdvertiser] = useState(mockAdvertisers[0]);
  const [isPartnersModalOpen, setIsPartnersModalOpen] = useState(false);
  
  const chartData = mockData.advertiser.partnerInformation.promotypeMix.value.map(item => ({
    name: item.promotype,
    value: item.count,
    color: COLORS[item.promotype as keyof typeof COLORS]
  }));

  const handleAdvertiserSelect = (advertiser: typeof mockAdvertisers[0]) => {
    setSelectedAdvertiser(advertiser);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Search Bar */}
      <AdvertiserSearch 
        onSelect={handleAdvertiserSelect}
        advertisers={mockAdvertisers}
      />

      {/* Header with selected advertiser name and logo */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl font-bold">{selectedAdvertiser.logo}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{selectedAdvertiser.name}</h1>
          <p className="text-gray-600">{t('analytics.advertiserAnalytics')}</p>
        </div>
      </div>

      {/* Partner Statistics */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            {/* Total Partners */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">{t('analytics.totalPartners')}</div>
              <div className="flex items-center justify-center gap-2">
                <ArrowUp className="w-4 h-4 text-green-500" />
                <span className="text-3xl font-bold text-green-500">1379</span>
              </div>
              <Button 
                variant="link" 
                className="text-sm text-gray-600 mt-2"
                onClick={() => setIsPartnersModalOpen(true)}
              >
                {t('analytics.viewPartners')}
              </Button>
            </div>

            {/* New Partners */}
            <div className="text-center border-l border-r border-gray-200 px-8">
              <div className="text-sm text-gray-600 mb-2">{t('analytics.newPartners')}</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-green-500">+153</span>
              </div>
              <Button variant="link" className="text-sm text-gray-600 mt-2">
                {t('analytics.showMe')}
              </Button>
            </div>

            {/* Lost Partners */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-6">{t('analytics.lostPartners')}</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-purple-500">-133</span>
              </div>
              <Button variant="link" className="text-sm text-gray-600 mt-2">
                {t('analytics.showMe')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Single row with Affiliate Mix Chart taking full width */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{t('analytics.affiliateMixChart')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-12">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-base text-gray-700 capitalize">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Top 20 Keywords */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              {t('analytics.topKeywords')}
              <Info className="w-4 h-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              {t('analytics.noKeywordsFound')}
            </div>
          </CardContent>
        </Card>

        {/* Vertical Positioning */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              {t('analytics.verticalPositioning')}
              <Info className="w-4 h-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">{t('analytics.type')}: </span>
                <span className="text-gray-600">{mockData.advertiser.verticals.sampleValue.name}</span>
              </div>
              <div>
                <span className="font-semibold">{t('analytics.rank')}: </span>
                <span className="text-gray-600">#{mockData.advertiser.verticals.sampleValue.rank}</span>
              </div>
              <div className="mt-6">
                <div className="font-semibold text-gray-700 mb-2">{t('analytics.topPublishersInVertical')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partners Modal */}
      <PartnersModal 
        isOpen={isPartnersModalOpen}
        onClose={() => setIsPartnersModalOpen(false)}
        partners={mockPartners}
        advertiserName={selectedAdvertiser.name}
      />
    </div>
  );
};

export default AdvertiserAnalytics;
