
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useTranslation } from "react-i18next";
import { getPlatformOwnerMetrics, getRecentActivity } from "@/services/mockDashboardData";

const PlatformOwnerDashboard: React.FC = () => {
  const { organization } = useAuth();
  const { t } = useTranslation();

  // Get realistic platform metrics and recent activity
  const platformMetrics = getPlatformOwnerMetrics();
  const recentActivity = getRecentActivity();

  const platformStats = [
    { 
      title: t("platformOwnerDashboard.totalOrganizations"), 
      value: platformMetrics.totalOrganizations.toString(), 
      change: `+${platformMetrics.monthlyGrowth}%` 
    },
    { 
      title: t("platformOwnerDashboard.totalUsers"), 
      value: platformMetrics.totalUsers.toString(), 
      change: "+12.5%" 
    },
    { 
      title: t("platformOwnerDashboard.totalRevenue"), 
      value: `$${platformMetrics.totalRevenue.toLocaleString()}`, 
      change: "+15.3%" 
    },
    { 
      title: t("platformOwnerDashboard.platformConversionRate"), 
      value: `${platformMetrics.platformConversionRate}%`, 
      change: "+2.1%" 
    },
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'advertiser': return 'bg-blue-100 text-blue-800';
      case 'affiliate': return 'bg-green-100 text-green-800';
      case 'platform_owner': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("platformOwnerDashboard.title")}</h1>
          <p className="text-muted-foreground">
            {t("platformOwnerDashboard.description")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/organizations">
            <Button>
              <Building2 className="w-4 h-4 mr-2" />
              Manage Organizations
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat, i) => (
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

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Organization Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View, approve, and manage all organizations on the platform
            </p>
            <Button className="w-full">Manage Organizations</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage user accounts and permissions across the platform
            </p>
            <Button variant="outline" className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Platform Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View comprehensive analytics and platform performance metrics
            </p>
            <Link to="/reporting">
              <Button variant="outline" className="w-full">View Analytics</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("platformOwnerDashboard.recentActivity")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.slice(0, 8).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  {activity.user && (
                    <p className="text-xs text-muted-foreground">by {activity.user}</p>
                  )}
                </div>
                {activity.amount && (
                  <div className="text-right">
                    <span className="text-sm font-medium">${activity.amount}</span>
                  </div>
                )}
                <div className="ml-4">
                  <Badge 
                    variant={activity.type === 'conversion' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Platform Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("platformOwnerDashboard.activeAdvertisers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platformMetrics.activeAdvertisers}</div>
            <p className="text-sm text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("platformOwnerDashboard.activeAffiliates")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{platformMetrics.activeAffiliates}</div>
            <p className="text-sm text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("platformOwnerDashboard.averageRevenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${platformMetrics.averageRevenuePerUser}</div>
            <p className="text-sm text-muted-foreground">per user</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default PlatformOwnerDashboard;
