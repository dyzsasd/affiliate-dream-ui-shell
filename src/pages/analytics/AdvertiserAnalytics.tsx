
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ExternalLink, TrendingUp, TrendingDown, Users, Globe, Mail, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

// Mock data based on the provided JSON
const mockAdvertiserData = {
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
    socialMedia: {
      count: 4,
      value: {
        twitter: "https://twitter.com/ankerofficial",
        youtube: "https://youtube.com/user/ankeroceanwing",
        facebook: "https://facebook.com/anker_fans",
        instagram: "https://instagram.com/anker_official"
      }
    },
    verticals: {
      value: [
        { name: "Technology / Electronics", rank: 2, score: 95 },
        { name: "Technology / Computers", rank: 2, score: 70 },
        { name: "Technology / Mobile & Broadband", rank: 2, score: 60 }
      ]
    },
    affiliateNetworks: {
      value: ["Admitad", "Avantlink", "Awin", "Business Insider", "CJ Affiliate", "Impact", "Rakuten"],
      count: 22
    },
    metaData: {
      description: "Discover Anker and shop chargers, batteries, hubs, docks, portable power stations, conferencing gear, and more.",
      faviconImageUrl: "https://storage.googleapis.com/pd-meta/logos/anker.com.png"
    },
    contactEmails: {
      value: [
        { value: "ecommerce@anker.com", department: "management" },
        { value: "support@anker.com", department: "support" },
        { value: "pr@anker.com", department: "support" }
      ],
      count: 9
    }
  }
};

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const AdvertiserAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const { advertiser } = mockAdvertiserData;

  // Prepare pie chart data
  const pieChartData = advertiser.partnerInformation.promotypeMix.value.map((item, index) => ({
    name: item.promotype,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src={advertiser.metaData.faviconImageUrl} 
            alt={advertiser.domain}
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold">{advertiser.domain}</h1>
            <p className="text-muted-foreground">{advertiser.metaData.description}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Follow
        </Button>
      </div>

      {/* Partner Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">TOTAL PARTNERS</p>
                <p className="text-3xl font-bold text-green-500">
                  <TrendingUp className="w-6 h-6 inline mr-2" />
                  {advertiser.partnerInformation.partners.count.toLocaleString()}
                </p>
                <Button variant="link" className="p-0 h-auto text-sm">
                  View partners
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Partners gained or lost in 30 days</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">NEW PARTNERS</p>
                  <p className="text-2xl font-bold text-green-500">
                    +{advertiser.partnerInformation.partnersAdded.count}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Show me
                  </Button>
                </div>
                <div>
                  <p className="text-sm font-medium">LOST PARTNERS</p>
                  <p className="text-2xl font-bold text-purple-500">
                    -{advertiser.partnerInformation.partnersRemoved.count}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Show me
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Social Media</p>
              <div className="flex space-x-2 mb-2">
                <Badge variant="secondary">
                  <Globe className="w-3 h-3 mr-1" />
                  {advertiser.socialMedia.count} platforms
                </Badge>
              </div>
              <div className="flex space-x-2">
                {Object.entries(advertiser.socialMedia.value).slice(0, 4).map(([platform, url]) => (
                  <Button key={platform} variant="outline" size="sm" asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {platform}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Affiliate Mix Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Mix Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-8">
              <div className="h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  {pieChartData.map((item, index) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-sm" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Networks */}
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Networks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {advertiser.affiliateNetworks.value.slice(0, 3).map((network, index) => (
                <div key={network} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-xs font-medium">{network.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium">{network}</span>
                </div>
              ))}
              <Button variant="link" className="p-0 h-auto text-sm">
                View more
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Vertical Positioning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Vertical Positioning
              <Badge variant="outline" className="ml-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                Technology / Electronics
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Type: Technology / Electronics</p>
                <p className="text-sm text-muted-foreground">Rank: #2</p>
                <p className="text-sm font-medium">Top 5 publishers in this vertical</p>
              </div>
              {advertiser.verticals.value.slice(0, 3).map((vertical, index) => (
                <div key={vertical.name} className="flex justify-between items-center">
                  <span className="text-sm">{vertical.name}</span>
                  <Badge variant="secondary">#{vertical.rank}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {advertiser.contactEmails.count} contact emails available
              </p>
              {advertiser.contactEmails.value.slice(0, 3).map((contact, index) => (
                <div key={contact.value} className="flex justify-between items-center">
                  <span className="text-sm font-mono">{contact.value}</span>
                  <Badge variant="outline" className="text-xs">
                    {contact.department}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View all contacts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvertiserAnalytics;
