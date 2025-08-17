
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { fetchAdvertisers } from "@/services/advertiserService";
import { fetchDashboardData } from "@/services/dashboardService";
import { DomainAdvertiser } from "@/generated-api/src/models";

const AdvertiserDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { organization } = useAuth();
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<string>("");

  // Fetch advertisers for the organization
  const { data: advertisers = [], isLoading: isLoadingAdvertisers } = useQuery({
    queryKey: ['advertisers', organization?.organizationId],
    queryFn: async () => {
      if (!organization?.organizationId) {
        throw new Error('No organization ID available');
      }
      return fetchAdvertisers(organization.organizationId);
    },
    enabled: !!organization?.organizationId,
  });

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['dashboard', organization?.organizationId, selectedAdvertiser],
    queryFn: async () => {
      return fetchDashboardData({
        period: 'today'
      });
    },
    enabled: !!organization?.organizationId && !!selectedAdvertiser,
  });

  // Set default advertiser when advertisers are loaded
  React.useEffect(() => {
    if (advertisers.length > 0 && !selectedAdvertiser) {
      setSelectedAdvertiser(advertisers[0].advertiserId?.toString() || "");
    }
  }, [advertisers, selectedAdvertiser]);

  // Extract data from dashboard response or use defaults
  const summary = dashboardData?.summary as any || {};
  const todayData = {
    clicks: { today: summary.totalClicks || 0, yesterday: 0, currentMonth: 0, lastMonth: 0, change: 0 },
    cost: { today: summary.revenue || 0.00, yesterday: 0.00, currentMonth: 0.00, lastMonth: 0.00, change: 0 },
    conversions: { today: summary.conversions || 0, yesterday: 0, currentMonth: 0, lastMonth: 0, change: 0 },
    cvr: { today: summary.conversionRate || 0.00, yesterday: 0.00, currentMonth: 0.00, lastMonth: 0.00, change: 0 },
    events: { today: 0, yesterday: 0, currentMonth: 0, lastMonth: 0, change: 0 },
    evr: { today: 0.00, yesterday: 0.00, currentMonth: 0.00, lastMonth: 0.00, change: 0 }
  };

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  if (isLoadingAdvertisers || isLoadingDashboard) {
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
          <p className="text-muted-foreground">Today's Stats</p>
        </div>
      </div>

      {/* Advertiser Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Select Advertiser:</label>
        <Select value={selectedAdvertiser} onValueChange={setSelectedAdvertiser}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select an advertiser" />
          </SelectTrigger>
          <SelectContent>
            {advertisers.map((advertiser) => (
              <SelectItem 
                key={advertiser.advertiserId} 
                value={advertiser.advertiserId?.toString() || ""}
              >
                {advertiser.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Today's Stats - 6 metric cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Clicks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clicks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Today</span>
              <div className="flex items-center space-x-1">
                {getChangeIcon(todayData.clicks.change)}
                <span className={`text-xs ${getChangeColor(todayData.clicks.change)}`}>
                  {todayData.clicks.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{todayData.clicks.today}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{todayData.clicks.yesterday}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{todayData.clicks.currentMonth}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{todayData.clicks.lastMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Today</span>
              <div className="flex items-center space-x-1">
                {getChangeIcon(todayData.cost.change)}
                <span className={`text-xs ${getChangeColor(todayData.cost.change)}`}>
                  {todayData.cost.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(todayData.cost.today)}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{formatCurrency(todayData.cost.yesterday)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{formatCurrency(todayData.cost.currentMonth)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{formatCurrency(todayData.cost.lastMonth)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Today</span>
              <div className="flex items-center space-x-1">
                {getChangeIcon(todayData.conversions.change)}
                <span className={`text-xs ${getChangeColor(todayData.conversions.change)}`}>
                  {todayData.conversions.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{todayData.conversions.today}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{todayData.conversions.yesterday}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{todayData.conversions.currentMonth}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{todayData.conversions.lastMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CVR */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CVR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Today</span>
              <div className="flex items-center space-x-1">
                {getChangeIcon(todayData.cvr.change)}
                <span className={`text-xs ${getChangeColor(todayData.cvr.change)}`}>
                  {todayData.cvr.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{formatPercentage(todayData.cvr.today)}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{formatPercentage(todayData.cvr.yesterday)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{formatPercentage(todayData.cvr.currentMonth)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{formatPercentage(todayData.cvr.lastMonth)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Today</span>
              <div className="flex items-center space-x-1">
                {getChangeIcon(todayData.events.change)}
                <span className={`text-xs ${getChangeColor(todayData.events.change)}`}>
                  {todayData.events.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{todayData.events.today}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{todayData.events.yesterday}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{todayData.events.currentMonth}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{todayData.events.lastMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EVR */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">EVR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Today</span>
              <div className="flex items-center space-x-1">
                {getChangeIcon(todayData.evr.change)}
                <span className={`text-xs ${getChangeColor(todayData.evr.change)}`}>
                  {todayData.evr.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{formatPercentage(todayData.evr.today)}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{formatPercentage(todayData.evr.yesterday)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{formatPercentage(todayData.evr.currentMonth)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{formatPercentage(todayData.evr.lastMonth)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Offers</CardTitle>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                placeholder="Search..."
                className="h-9 w-64 rounded-md border border-input px-3 py-1 text-sm bg-background"
              />
              <button className="h-9 w-9 rounded-md border border-input flex items-center justify-center">
                <span className="text-lg">⋮</span>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Offer</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Clicks</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Uniq. Clicks</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Inv. Clicks</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">CV</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Events</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">CVR</th>
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">EVR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground italic">
                    No Record Found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">0 Total</span>
            <div className="flex items-center space-x-2">
              <button className="h-8 w-8 rounded border border-input flex items-center justify-center disabled:opacity-50" disabled>
                ‹‹
              </button>
              <button className="h-8 w-8 rounded border border-input flex items-center justify-center disabled:opacity-50" disabled>
                ‹
              </button>
              <span className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center text-sm">
                1
              </span>
              <button className="h-8 w-8 rounded border border-input flex items-center justify-center disabled:opacity-50" disabled>
                ›
              </button>
              <button className="h-8 w-8 rounded border border-input flex items-center justify-center disabled:opacity-50" disabled>
                ››
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertiserDashboard;
