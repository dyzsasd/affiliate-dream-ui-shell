
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { mockPerformanceData, mockCampaigns } from "@/services/api";
import { getReportingPerformanceData } from "@/services/mockDashboardData";

const PerformanceReport: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState("7days");
  const [campaignFilter, setCampaignFilter] = useState("all");
  
  // Get filtered performance data based on date range
  const performanceData = getReportingPerformanceData(dateRange);
  
  // Filter by campaign if needed
  const formattedData = campaignFilter === "all" 
    ? performanceData 
    : performanceData; // Would filter by campaign in real implementation

  // Calculate totals with real data
  const totalClicks = formattedData.reduce((sum, item) => sum + item.clicks, 0);
  const totalImpressions = formattedData.reduce((sum, item) => sum + item.impressions, 0);
  const totalConversions = formattedData.reduce((sum, item) => sum + item.conversions, 0);
  const totalRevenue = formattedData.reduce((sum, item) => sum + item.revenue, 0);
  
  const conversionRate = totalClicks > 0 
    ? ((totalConversions / totalClicks) * 100).toFixed(2) 
    : "0";
  
  const ctr = totalImpressions > 0 
    ? ((totalClicks / totalImpressions) * 100).toFixed(2) 
    : "0";

  const stats = [
    { title: t("reports.performance.impressions"), value: totalImpressions.toLocaleString() },
    { title: t("reports.performance.clicks"), value: totalClicks.toLocaleString() },
    { title: t("reports.performance.ctr"), value: `${ctr}%` },
    { title: t("reports.performance.conversions"), value: totalConversions.toLocaleString() },
    { title: t("reports.performance.conversionRate"), value: `${conversionRate}%` },
    { title: t("reports.performance.revenue"), value: `$${totalRevenue.toLocaleString()}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">{t("reports.performance.title")}</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("reports.performance.selectDateRange")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="7days">{t("reports.performance.last7Days")}</SelectItem>
                <SelectItem value="30days">{t("reports.performance.last30Days")}</SelectItem>
                <SelectItem value="90days">{t("reports.performance.last3Months")}</SelectItem>
                <SelectItem value="year">{t("reports.performance.last12Months")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("reports.performance.filterByCampaign")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">{t("reports.performance.allCampaigns")}</SelectItem>
                {mockCampaigns.map(campaign => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">{stat.title}</div>
              <div className="text-2xl font-bold mt-1">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>{t("reports.performance.performanceMetrics")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="traffic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="traffic">{t("reports.performance.traffic")}</TabsTrigger>
              <TabsTrigger value="conversions">{t("reports.performance.conversions")}</TabsTrigger>
              <TabsTrigger value="revenue">{t("reports.performance.revenue")}</TabsTrigger>
              <TabsTrigger value="rates">{t("reports.performance.rates")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="traffic" className="py-4">
              <div className="h-[400px]">
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
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="impressions"
                      name={t("reports.performance.impressions")}
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="clicks"
                      name={t("reports.performance.clicks")}
                      stroke="#4338ca"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="conversions" className="py-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formattedData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="conversions"
                      name={t("reports.performance.conversions")}
                      stroke="#4338ca"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="revenue" className="py-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formattedData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, t("reports.performance.revenue")]} />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name={t("reports.performance.revenue")}
                      fill="#4338ca"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="rates" className="py-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formattedData.map(item => ({
                      ...item,
                      ctr: item.impressions > 0 ? (item.clicks / item.impressions * 100).toFixed(2) : 0,
                      convRate: item.clicks > 0 ? (item.conversions / item.clicks * 100).toFixed(2) : 0
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ctr"
                      name={t("reports.performance.clickThroughRate")}
                      stroke="#6366f1"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="convRate"
                      name={t("reports.performance.conversionRate")}
                      stroke="#4338ca"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("reports.performance.dailyPerformanceData")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="w-full overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left font-medium">{t("reports.performance.date")}</th>
                    <th className="h-10 px-4 text-right font-medium">{t("reports.performance.impressions")}</th>
                    <th className="h-10 px-4 text-right font-medium">{t("reports.performance.clicks")}</th>
                    <th className="h-10 px-4 text-right font-medium">{t("reports.performance.ctr")}</th>
                    <th className="h-10 px-4 text-right font-medium">{t("reports.performance.conversions")}</th>
                    <th className="h-10 px-4 text-right font-medium">{t("reports.performance.conversionRate")}</th>
                    <th className="h-10 px-4 text-right font-medium">{t("reports.performance.revenue")}</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedData.map((item, i) => {
                    const ctr = item.impressions > 0 ? (item.clicks / item.impressions * 100).toFixed(2) : "0";
                    const convRate = item.clicks > 0 ? (item.conversions / item.clicks * 100).toFixed(2) : "0";
                    
                    return (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-2">{item.date}</td>
                        <td className="px-4 py-2 text-right">{item.impressions.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{item.clicks.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{ctr}%</td>
                        <td className="px-4 py-2 text-right">{item.conversions.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">{convRate}%</td>
                        <td className="px-4 py-2 text-right">${item.revenue.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <th className="h-10 px-4 text-left font-medium">{t("reports.performance.total")}</th>
                    <th className="h-10 px-4 text-right font-medium">
                      {totalImpressions.toLocaleString()}
                    </th>
                    <th className="h-10 px-4 text-right font-medium">
                      {totalClicks.toLocaleString()}
                    </th>
                    <th className="h-10 px-4 text-right font-medium">{ctr}%</th>
                    <th className="h-10 px-4 text-right font-medium">
                      {totalConversions.toLocaleString()}
                    </th>
                    <th className="h-10 px-4 text-right font-medium">{conversionRate}%</th>
                    <th className="h-10 px-4 text-right font-medium">
                      ${totalRevenue.toFixed(2)}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceReport;
