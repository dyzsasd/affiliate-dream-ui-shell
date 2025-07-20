
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const PlatformOwnerDashboard: React.FC = () => {
  const { organization } = useAuth();

  // Mock data for platform owner dashboard
  const platformStats = [
    { title: "Total Organizations", value: "0", change: "0" },
    { title: "Active Advertisers", value: "0", change: "0" },
    { title: "Active Affiliates", value: "0", change: "0" },
    { title: "Platform Revenue", value: "$0", change: "0%" },
  ];

  const recentOrganizations = [
    { id: 1, name: "TechCorp Inc.", type: "advertiser", status: "active", joinedDate: "2024-01-15" },
    { id: 2, name: "Marketing Pro", type: "affiliate", status: "pending", joinedDate: "2024-01-14" },
    { id: 3, name: "E-commerce Plus", type: "advertiser", status: "active", joinedDate: "2024-01-13" },
    { id: 4, name: "Affiliate Network", type: "affiliate", status: "inactive", joinedDate: "2024-01-12" },
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
          <h1 className="text-2xl font-bold tracking-tight">Platform Owner Dashboard</h1>
          <p className="text-muted-foreground">
            Manage organizations and monitor platform performance
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

      {/* Recent Organizations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Organizations</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrganizations.map((org) => (
              <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{org.name}</h4>
                    <Badge className={getTypeColor(org.type)}>
                      {org.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Joined: {new Date(org.joinedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(org.status)}>
                    {org.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformOwnerDashboard;
