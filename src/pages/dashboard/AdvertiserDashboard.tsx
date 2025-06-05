
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart } from "lucide-react";
import { mockPerformanceData } from "@/services/api";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart as RechartsBarChart } from "recharts";

const AdvertiserDashboard: React.FC = () => {
  // Format dates for display
  const formattedData = mockPerformanceData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const totalClicks = mockPerformanceData.reduce((sum, item) => sum + item.clicks, 0);
  const totalConversions = mockPerformanceData.reduce((sum, item) => sum + item.conversions, 0);
  const totalRevenue = mockPerformanceData.reduce((sum, item) => sum + item.revenue, 0);
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : "0";

  const stats = [
    { title: "Total Clicks", value: totalClicks.toLocaleString(), change: "+12.5%" },
    { title: "Conversions", value: totalConversions.toLocaleString(), change: "+7.2%" },
    { title: "Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+15.3%" },
    { title: "Conversion Rate", value: `${conversionRate}%`, change: "+2.4%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Advertiser Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select className="h-9 rounded-md border border-input px-3 py-1 text-sm bg-background">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 12 months</option>
          </select>
        </div>
      </div>

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
              <CardTitle className="text-lg">Campaign Performance</CardTitle>
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
              <CardTitle className="text-lg">Revenue</CardTitle>
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Campaign Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New conversion from Campaign: Summer Promotion</p>
                <p className="text-xs text-muted-foreground">2 hours ago • $15.00</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Campaign created: Premium Subscription</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New conversion from Campaign: Premium Subscription</p>
                <p className="text-xs text-muted-foreground">Yesterday • $30.00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertiserDashboard;
