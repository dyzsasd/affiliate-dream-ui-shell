
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Link as LinkIcon, TrendingUp, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const AffiliateDashboard: React.FC = () => {
  // Mock data for affiliate dashboard
  const affiliateStats = [
    { title: "Total Earnings", value: "$2,456", change: "+18.2%" },
    { title: "Active Links", value: "23", change: "+3" },
    { title: "Clicks This Month", value: "1,247", change: "+12.8%" },
    { title: "Conversion Rate", value: "3.2%", change: "+0.5%" },
  ];

  const recentLinks = [
    { id: 1, campaign: "Summer Sale 2024", url: "https://track.example.com/abc123", clicks: 145, earnings: "$87.50" },
    { id: 2, campaign: "Premium Subscription", url: "https://track.example.com/def456", clicks: 89, earnings: "$178.00" },
    { id: 3, campaign: "Mobile App Promo", url: "https://track.example.com/ghi789", clicks: 234, earnings: "$156.80" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Affiliate Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Link to="/tracking-links">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Generate New Link
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {affiliateStats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <span className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                compared to previous period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <LinkIcon className="w-5 h-5 mr-2" />
              Generate Tracking Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create new tracking links for available campaigns
            </p>
            <Link to="/tracking-links">
              <Button className="w-full">Generate Link</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              View Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Check your performance metrics and earnings
            </p>
            <Link to="/reporting">
              <Button variant="outline" className="w-full">View Reports</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Track Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor your conversion performance
            </p>
            <Link to="/reporting/conversions">
              <Button variant="outline" className="w-full">View Conversions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tracking Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Tracking Links</CardTitle>
          <Link to="/tracking-links">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{link.campaign}</h4>
                  <p className="text-sm text-muted-foreground">{link.url}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{link.clicks} clicks</p>
                  <p className="text-sm text-green-600">{link.earnings}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateDashboard;
