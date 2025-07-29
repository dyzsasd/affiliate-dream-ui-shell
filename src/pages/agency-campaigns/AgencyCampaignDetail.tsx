import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Edit, Building2, Calendar, DollarSign, Target, TrendingUp } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const AgencyCampaignDetail: React.FC = () => {
  const { id } = useParams();

  // Mock campaign data
  const campaign = {
    id: id || "1",
    name: "Summer Sale 2024",
    description: "Comprehensive summer marketing campaign targeting seasonal buyers with discounts and promotions",
    status: "active" as const,
    advertiserOrganization: {
      id: "org-1",
      name: "TechCorp Inc.",
      logo: "/placeholder-logo.png"
    },
    budget: 50000,
    spent: 32500,
    dailyBudget: 1600,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    objectives: ["Brand Awareness", "Lead Generation"],
    channels: ["Facebook Ads", "Google Ads", "Instagram"],
    targetAudience: "Adults aged 25-45, interested in summer products and seasonal shopping",
    performance: {
      impressions: 450000,
      clicks: 8500,
      conversions: 185,
      ctr: 1.89,
      cpa: 175.68,
      roas: 4.2
    }
  };

  // Mock performance data for charts
  const performanceData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    impressions: Math.floor(Math.random() * 20000) + 10000,
    clicks: Math.floor(Math.random() * 500) + 200,
    conversions: Math.floor(Math.random() * 15) + 5,
    spend: Math.floor(Math.random() * 2000) + 800
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const budgetProgress = (campaign.spent / campaign.budget) * 100;
  const daysRemaining = Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const chartConfig = {
    impressions: {
      label: "Impressions",
      color: "hsl(var(--primary))",
    },
    clicks: {
      label: "Clicks", 
      color: "hsl(var(--chart-2))",
    },
    conversions: {
      label: "Conversions",
      color: "hsl(var(--chart-3))",
    },
    spend: {
      label: "Spend ($)",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/agency-campaigns">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{campaign.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{campaign.advertiserOrganization.name}</span>
              </div>
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        <Link to={`/agency-campaigns/${id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Campaign
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Progress</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${campaign.spent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mb-2">
              of ${campaign.budget.toLocaleString()} budget
            </p>
            <Progress value={budgetProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {budgetProgress.toFixed(1)}% spent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.performance.conversions}</div>
            <p className="text-xs text-muted-foreground">
              CPA: ${campaign.performance.cpa.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.performance.ctr}%</div>
            <p className="text-xs text-muted-foreground">
              {campaign.performance.clicks.toLocaleString()} clicks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.performance.roas}x</div>
            <p className="text-xs text-muted-foreground">
              Return on ad spend
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Campaign Details */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
              <p className="text-sm">{campaign.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Start Date</h4>
                <p className="text-sm">{new Date(campaign.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">End Date</h4>
                <p className="text-sm">{new Date(campaign.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Campaign Duration</h4>
              <p className="text-sm">{daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Campaign ended'}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Daily Budget</h4>
              <p className="text-sm">${campaign.dailyBudget.toLocaleString()}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Target Audience</h4>
              <p className="text-sm">{campaign.targetAudience}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Objectives</h4>
              <div className="flex flex-wrap gap-1">
                {campaign.objectives.map((objective, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {objective}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Marketing Channels</h4>
              <div className="flex flex-wrap gap-1">
                {campaign.channels.map((channel, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Charts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="spend" 
                      stroke="hsl(var(--chart-4))" 
                      fill="hsl(var(--chart-4))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyCampaignDetail;