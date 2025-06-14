
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

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
  const chartData = mockData.advertiser.partnerInformation.promotypeMix.value.map(item => ({
    name: item.promotype,
    value: item.count,
    color: COLORS[item.promotype as keyof typeof COLORS]
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Partner Statistics */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-8">
            {/* Total Partners */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">TOTAL PARTNERS</div>
              <div className="flex items-center justify-center gap-2">
                <ArrowUp className="w-4 h-4 text-green-500" />
                <span className="text-3xl font-bold text-green-500">1379</span>
              </div>
              <Button variant="link" className="text-sm text-gray-600 mt-2">
                View partners
              </Button>
            </div>

            {/* New Partners */}
            <div className="text-center border-l border-r border-gray-200 px-8">
              <div className="text-sm text-gray-500 mb-2">Partners gained or lost in 30 days</div>
              <div className="text-sm text-gray-600 mb-2">NEW PARTNERS</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-green-500">+153</span>
              </div>
              <Button variant="link" className="text-sm text-gray-600 mt-2">
                Show me
              </Button>
            </div>

            {/* Lost Partners */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-6">LOST PARTNERS</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-purple-500">-133</span>
              </div>
              <Button variant="link" className="text-sm text-gray-600 mt-2">
                Show me
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Affiliate Mix Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Affiliate Mix Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {chartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Networks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Affiliate Networks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.advertiser.affiliateNetworks.sampleValue.map((network, index) => (
                <div key={network} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    {network.charAt(0)}
                  </div>
                  <span className="text-gray-700">{network}</span>
                </div>
              ))}
              <Button variant="link" className="text-sm text-gray-600 p-0 mt-4">
                View more
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top 20 Keywords */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              Top 20 Keywords
              <Info className="w-4 h-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              No keywords found
            </div>
          </CardContent>
        </Card>

        {/* Vertical Positioning */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              Vertical Positioning
              <Info className="w-4 h-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Type: </span>
                <span className="text-gray-600">{mockData.advertiser.verticals.sampleValue.name}</span>
              </div>
              <div>
                <span className="font-semibold">Rank: </span>
                <span className="text-gray-600">#{mockData.advertiser.verticals.sampleValue.rank}</span>
              </div>
              <div className="mt-6">
                <div className="font-semibold text-gray-700 mb-2">Top 5 publishers in this vertical</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvertiserAnalytics;
