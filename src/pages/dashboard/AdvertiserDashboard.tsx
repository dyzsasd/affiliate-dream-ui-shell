
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, RefreshCw } from "lucide-react";
import { mockPerformanceData } from "@/services/api";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart as RechartsBarChart } from "recharts";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { fetchAdvertisers } from "@/services/advertiserService";

const AdvertiserDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { organization } = useAuth();

  // Fetch advertisers for the organization
  const { data: advertisers = [], isLoading: isLoadingAdvertisers, isError } = useQuery({
    queryKey: ['advertisers', organization?.organizationId],
    queryFn: async () => {
      if (!organization?.organizationId) {
        throw new Error('No organization ID available');
      }
      return fetchAdvertisers(organization.organizationId);
    },
    enabled: !!organization?.organizationId,
  });

  // Set all data to 0 and format dates for display
  const formattedData = mockPerformanceData.map(item => ({
    ...item,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const totalClicks = formattedData.reduce((sum, item) => sum + item.clicks, 0);
  const totalConversions = formattedData.reduce((sum, item) => sum + item.conversions, 0);
  const totalRevenue = formattedData.reduce((sum, item) => sum + item.revenue, 0);
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : "0";

  const stats = [
    { title: t("dashboard.totalClicks"), value: totalClicks.toLocaleString(), change: "0%" },
    { title: t("dashboard.conversions"), value: totalConversions.toLocaleString(), change: "0%" },
    { title: t("dashboard.revenue"), value: `$${totalRevenue.toLocaleString()}`, change: "0%" },
    { title: t("dashboard.conversionRate"), value: `${conversionRate}%`, change: "0%" },
  ];

  if (isLoadingAdvertisers) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.advertiserDashboard")}</h1>
          {advertisers.length > 0 && (
            <p className="text-muted-foreground">
              Managing {advertisers.length} advertiser{advertisers.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <select className="h-9 rounded-md border border-input px-3 py-1 text-sm bg-background">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Advertisers Overview */}
      {advertisers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advertisers Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {advertisers.slice(0, 6).map((advertiser) => (
                <div key={advertiser.advertiserId} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{advertiser.name}</h3>
                  <p className="text-sm text-muted-foreground">{advertiser.contactEmail}</p>
                  <div className="mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      advertiser.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : advertiser.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {advertiser.status || 'unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
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

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="mr-2 p-2 rounded-md bg-primary/10">
              <AreaChart className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{t("dashboard.campaignPerformance")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily clicks and conversions
              </p>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formattedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="clicks"
                    stroke="#6366f1"
                    name="Clicks"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversions"
                    stroke="#4338ca"
                    name="Conversions"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="mr-2 p-2 rounded-md bg-primary/10">
              <BarChart className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{t("dashboard.revenueChart")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily revenue generated
              </p>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={formattedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#4338ca"
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default AdvertiserDashboard;
