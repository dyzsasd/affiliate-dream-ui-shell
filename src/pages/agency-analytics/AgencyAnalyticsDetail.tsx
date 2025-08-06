import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowLeft, Edit, Download, RefreshCw } from "lucide-react";

// Market Analytics Dashboard Component - Completely rewritten
const AgencyAnalyticsDetail: React.FC = () => {
  const { t } = useTranslation();
  const { analyticsId } = useParams();
  const [timeRange, setTimeRange] = useState("1h");

  // Generate market-focused time series data
  const generateMarketData = useMemo(() => {
    const createDataPoints = (points: number, baseValue: number, variance: number) => {
      return Array.from({ length: points }, (_, i) => ({
        time: new Date(Date.now() - (points - i) * 60000).toISOString().substr(11, 5),
        value: Math.round(baseValue + (Math.random() - 0.5) * variance * 2)
      }));
    };

    return {
      revenue: createDataPoints(60, 15000, 3000),
      impressions: createDataPoints(60, 450000, 80000),
      clicks: createDataPoints(60, 8500, 1500),
      conversions: createDataPoints(60, 185, 35),
      adSpend: createDataPoints(60, 2800, 500),
      roas: createDataPoints(60, 4.2, 0.8),
      cpm: createDataPoints(60, 12.5, 2.5),
      ctr: createDataPoints(60, 1.9, 0.4),
    };
  }, [timeRange]);

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--primary))",
    },
  };

  console.log("Market Analytics Dashboard loaded - all data defined correctly");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/agency-analytics">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Market Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">Dashboard #{analyticsId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link to={`/agency-analytics/${analyticsId}/edit`}>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Revenue Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Revenue & Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Revenue ($)</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateMarketData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Return on Ad Spend (ROAS)</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateMarketData.roas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Audience Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Total Impressions</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateMarketData.impressions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Click-Through Rate (%)</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateMarketData.ctr}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--chart-3))" 
                      fill="hsl(var(--chart-3))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Conversion & Cost Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Total Clicks</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateMarketData.clicks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(var(--chart-4))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Conversions</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateMarketData.conversions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--chart-5))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Ad Spend ($)</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateMarketData.adSpend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="orange" 
                      fill="orange" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Cost Per Mille (CPM)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateMarketData.cpm}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--chart-1))" 
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
            <CardTitle className="text-green-600">Market Share Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generateMarketData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--chart-2))" 
                    fill="hsl(var(--chart-2))" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgencyAnalyticsDetail;