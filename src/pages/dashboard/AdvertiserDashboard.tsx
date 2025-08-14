
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { fetchAdvertisers } from "@/services/advertiserService";
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

  // Set default advertiser when advertisers are loaded
  React.useEffect(() => {
    if (advertisers.length > 0 && !selectedAdvertiser) {
      setSelectedAdvertiser(advertisers[0].advertiserId?.toString() || "");
    }
  }, [advertisers, selectedAdvertiser]);

  // Mock data for demonstration - in real app, this would be fetched based on selectedAdvertiser
  const mockTodayData = {
    clicks: { today: 0, yesterday: 0, currentMonth: 0, lastMonth: 0, change: 0 },
    cost: { today: 0.00, yesterday: 0.00, currentMonth: 0.00, lastMonth: 0.00, change: 0 },
    conversions: { today: 0, yesterday: 0, currentMonth: 0, lastMonth: 0, change: 0 },
    cvr: { today: 0.00, yesterday: 0.00, currentMonth: 0.00, lastMonth: 0.00, change: 0 },
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
                {getChangeIcon(mockTodayData.clicks.change)}
                <span className={`text-xs ${getChangeColor(mockTodayData.clicks.change)}`}>
                  {mockTodayData.clicks.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{mockTodayData.clicks.today}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{mockTodayData.clicks.yesterday}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{mockTodayData.clicks.currentMonth}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{mockTodayData.clicks.lastMonth}</span>
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
                {getChangeIcon(mockTodayData.cost.change)}
                <span className={`text-xs ${getChangeColor(mockTodayData.cost.change)}`}>
                  {mockTodayData.cost.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(mockTodayData.cost.today)}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{formatCurrency(mockTodayData.cost.yesterday)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{formatCurrency(mockTodayData.cost.currentMonth)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{formatCurrency(mockTodayData.cost.lastMonth)}</span>
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
                {getChangeIcon(mockTodayData.conversions.change)}
                <span className={`text-xs ${getChangeColor(mockTodayData.conversions.change)}`}>
                  {mockTodayData.conversions.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{mockTodayData.conversions.today}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{mockTodayData.conversions.yesterday}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{mockTodayData.conversions.currentMonth}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{mockTodayData.conversions.lastMonth}</span>
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
                {getChangeIcon(mockTodayData.cvr.change)}
                <span className={`text-xs ${getChangeColor(mockTodayData.cvr.change)}`}>
                  {mockTodayData.cvr.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{formatPercentage(mockTodayData.cvr.today)}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{formatPercentage(mockTodayData.cvr.yesterday)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{formatPercentage(mockTodayData.cvr.currentMonth)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{formatPercentage(mockTodayData.cvr.lastMonth)}</span>
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
                {getChangeIcon(mockTodayData.events.change)}
                <span className={`text-xs ${getChangeColor(mockTodayData.events.change)}`}>
                  {mockTodayData.events.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{mockTodayData.events.today}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{mockTodayData.events.yesterday}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{mockTodayData.events.currentMonth}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{mockTodayData.events.lastMonth}</span>
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
                {getChangeIcon(mockTodayData.evr.change)}
                <span className={`text-xs ${getChangeColor(mockTodayData.evr.change)}`}>
                  {mockTodayData.evr.change}%
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold">{formatPercentage(mockTodayData.evr.today)}</div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Yesterday</span>
                <span>{formatPercentage(mockTodayData.evr.yesterday)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Month</span>
                <span>{formatPercentage(mockTodayData.evr.currentMonth)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Month</span>
                <span>{formatPercentage(mockTodayData.evr.lastMonth)}</span>
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
