import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowLeft, Edit, Download, RefreshCw } from "lucide-react";

const AgencyAnalyticsDetail: React.FC = () => {
  const { t } = useTranslation();
  const { analyticsId } = useParams();
  const [timeRange, setTimeRange] = useState("1h");

  // Mock time series data
  const generateTimeSeriesData = (points: number, baseValue: number, variance: number) => {
    return Array.from({ length: points }, (_, i) => ({
      time: new Date(Date.now() - (points - i) * 60000).toISOString().substr(11, 5),
      value: Math.round(baseValue + (Math.random() - 0.5) * variance * 2)
    }));
  };

  const performanceData = generateTimeSeriesData(60, 85, 15);
  const throughputData = generateTimeSeriesData(60, 1200, 300);
  const connectionData = generateTimeSeriesData(60, 45, 10);
  const cpuData = generateTimeSeriesData(60, 65, 20);
  const memoryData = generateTimeSeriesData(60, 78, 12);
  const networkData = generateTimeSeriesData(60, 150, 50);

  const queryData = generateTimeSeriesData(60, 500, 200);
  const cacheData = generateTimeSeriesData(60, 92, 8);

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
              {t("agencyAnalytics.analyticsDetail")}
            </h1>
            <p className="text-muted-foreground">Analytics Dashboard #{analyticsId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">{t("agencyAnalytics.lastHour")}</SelectItem>
              <SelectItem value="24h">{t("agencyAnalytics.last24Hours")}</SelectItem>
              <SelectItem value="7d">{t("agencyAnalytics.last7Days")}</SelectItem>
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
              {t("agencyAnalytics.editAnalytics")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Performance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">{t("agencyAnalytics.performance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">{t("agencyAnalytics.slowQueryRate")}</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
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
              <h4 className="text-sm font-medium mb-3">{t("agencyAnalytics.queryRuntime")}</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={queryData}>
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

      {/* Throughput Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">{t("agencyAnalytics.throughput")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">{t("agencyAnalytics.selectQueries")}</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={throughputData}>
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
              <h4 className="text-sm font-medium mb-3">{t("agencyAnalytics.insertQueries")}</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={connectionData}>
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

      {/* System Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">{t("agencyAnalytics.systemResources")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">{t("agencyAnalytics.cpuUsage")}</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cpuData}>
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
              <h4 className="text-sm font-medium mb-3">{t("agencyAnalytics.systemMemory")}</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={memoryData}>
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
              <h4 className="text-sm font-medium mb-3">{t("agencyAnalytics.networkTraffic")}</h4>
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={networkData}>
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

      {/* Cache Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">{t("agencyAnalytics.cacheUtilization")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cacheData}>
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
            <CardTitle className="text-green-600">{t("agencyAnalytics.dataReadsWrites")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
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