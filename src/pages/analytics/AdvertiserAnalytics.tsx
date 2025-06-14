
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Activity, DollarSign, Percent } from "lucide-react";
import { useTranslation } from "react-i18next";

// Mock data for the dashboard
const metricsData = [
  {
    title: "总点击",
    value: "190,800",
    change: "+12.5%",
    changeType: "positive",
    icon: Activity,
    subtitle: "compared to previous period"
  },
  {
    title: "转化",
    value: "10,200",
    change: "+7.2%",
    changeType: "positive",
    icon: TrendingUp,
    subtitle: "compared to previous period"
  },
  {
    title: "总收入",
    value: "$153,000",
    change: "+15.3%",
    changeType: "positive",
    icon: DollarSign,
    subtitle: "compared to previous period"
  },
  {
    title: "转化率",
    value: "5.35%",
    change: "+2.4%",
    changeType: "positive",
    icon: Percent,
    subtitle: "compared to previous period"
  }
];

const performanceData = [
  { date: "Jul 1", clicks: 22000, conversions: 1200 },
  { date: "Jul 2", clicks: 32000, conversions: 1800 },
  { date: "Jul 3", clicks: 15000, conversions: 900 },
  { date: "Jul 4", clicks: 28000, conversions: 1600 },
  { date: "Jul 5", clicks: 31000, conversions: 1900 },
  { date: "Jul 6", clicks: 25000, conversions: 1500 },
  { date: "Jul 7", clicks: 27000, conversions: 1700 }
];

const revenueData = [
  { date: "Jul 1", revenue: 18000 },
  { date: "Jul 2", revenue: 28000 },
  { date: "Jul 3", revenue: 12000 },
  { date: "Jul 4", revenue: 22000 },
  { date: "Jul 5", revenue: 30000 },
  { date: "Jul 6", revenue: 20000 },
  { date: "Jul 7", revenue: 25000 }
];

const recentActivities = [
  {
    title: "New conversion from Campaign: Summer Promotion",
    time: "2 hours ago",
    amount: "$150.00"
  },
  {
    title: "Click from Campaign: Back to School",
    time: "4 hours ago",
    amount: "$25.00"
  },
  {
    title: "Conversion from Campaign: Holiday Sale",
    time: "6 hours ago",
    amount: "$200.00"
  }
];

const AdvertiserAnalytics: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">概览</h1>
        <Select defaultValue="last7days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7days">Last 7 days</SelectItem>
            <SelectItem value="last30days">Last 30 days</SelectItem>
            <SelectItem value="last3months">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsData.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{metric.value}</p>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      metric.changeType === 'positive' 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-red-600 bg-red-50'
                    }`}
                  >
                    {metric.change}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {metric.subtitle}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>营销表现</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Daily clicks and conversions</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    className="text-xs"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    className="text-xs"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>收入</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Daily revenue generated</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    className="text-xs"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time} • {activity.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertiserAnalytics;
