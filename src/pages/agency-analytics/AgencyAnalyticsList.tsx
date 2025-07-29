import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart3, TrendingUp, Activity } from "lucide-react";

const AgencyAnalyticsList: React.FC = () => {
  const { t } = useTranslation();

  // Mock data for analytics dashboards
  const analyticsDashboards = [
    {
      id: "1",
      name: "Main Performance Dashboard",
      description: "Overall system performance monitoring",
      status: "active",
      lastUpdated: "2024-01-15T10:30:00Z",
      metrics: 12
    },
    {
      id: "2", 
      name: "Database Analytics",
      description: "Database performance and query monitoring",
      status: "active",
      lastUpdated: "2024-01-15T09:15:00Z",
      metrics: 8
    },
    {
      id: "3",
      name: "Network Traffic Analysis", 
      description: "Network performance and traffic patterns",
      status: "inactive",
      lastUpdated: "2024-01-14T16:45:00Z",
      metrics: 6
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("agencyAnalytics.analyticsList")}
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and analyze system performance metrics
          </p>
        </div>
        <Link to="/agency-analytics/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("agencyAnalytics.createAnalytics")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {analyticsDashboards.map((dashboard) => (
          <Card key={dashboard.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                </div>
                <Badge variant={dashboard.status === "active" ? "default" : "secondary"}>
                  {dashboard.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {dashboard.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Activity className="h-4 w-4" />
                  <span>{dashboard.metrics} metrics</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Live</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(dashboard.lastUpdated).toLocaleString()}
              </div>

              <div className="flex space-x-2">
                <Link to={`/agency-analytics/${dashboard.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Dashboard
                  </Button>
                </Link>
                <Link to={`/agency-analytics/${dashboard.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgencyAnalyticsList;