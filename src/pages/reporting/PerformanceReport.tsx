
import React, { useState } from "react";
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

const PerformanceReport: React.FC = () => {
  const [dateRange, setDateRange] = useState("7days");
  const [campaignFilter, setCampaignFilter] = useState("all");
  
  // Format dates for display
  const formattedData = mockPerformanceData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  // Calculate totals
  const totalClicks = mockPerformanceData.reduce((sum, item) => sum + item.clicks, 0);
  const totalImpressions = mockPerformanceData.reduce((sum, item) => sum + item.impressions, 0);
  const totalConversions = mockPerformanceData.reduce((sum, item) => sum + item.conversions, 0);
  const totalRevenue = mockPerformanceData.reduce((sum, item) => sum + item.revenue, 0);
  
  const conversionRate = totalClicks > 0 
    ? ((totalConversions / totalClicks) * 100).toFixed(2) 
    : "0";
  
  const ctr = totalImpressions > 0 
    ? ((totalClicks / totalImpressions) * 100).toFixed(2) 
    : "0";

  const stats = [
    { title: "Impressions", value: totalImpressions.toLocaleString() },
    { title: "Clicks", value: totalClicks.toLocaleString() },
    { title: "CTR", value: `${ctr}%` },
    { title: "Conversions", value: totalConversions.toLocaleString() },
    { title: "Conv. Rate", value: `${conversionRate}%` },
    { title: "Revenue", value: `$${totalRevenue.toLocaleString()}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Performance Report</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 3 months</SelectItem>
                <SelectItem value="year">Last 12 months</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Campaigns</SelectItem>
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
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="traffic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="traffic">Traffic</TabsTrigger>
              <TabsTrigger value="conversions">Conversions</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="rates">Rates</TabsTrigger>
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
                      name="Impressions"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="clicks"
                      name="Clicks"
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
                      name="Conversions"
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
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Revenue"
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
                      name="Click-Through Rate"
                      stroke="#6366f1"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="convRate"
                      name="Conversion Rate"
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
          <CardTitle>Daily Performance Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="w-full overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left font-medium">Date</th>
                    <th className="h-10 px-4 text-right font-medium">Impressions</th>
                    <th className="h-10 px-4 text-right font-medium">Clicks</th>
                    <th className="h-10 px-4 text-right font-medium">CTR</th>
                    <th className="h-10 px-4 text-right font-medium">Conversions</th>
                    <th className="h-10 px-4 text-right font-medium">Conv. Rate</th>
                    <th className="h-10 px-4 text-right font-medium">Revenue</th>
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
                    <th className="h-10 px-4 text-left font-medium">Total</th>
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
