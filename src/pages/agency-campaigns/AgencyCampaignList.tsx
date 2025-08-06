import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CheckCircle2,
  PauseCircle,
  FileEdit,
  Plus,
  Search,
  Filter,
  Building2,
  TrendingUp
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/auth";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  advertiserOrganization: {
    id: string;
    name: string;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
  };
}

const AgencyCampaignList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { t } = useTranslation();
  const { organization } = useAuth();

  // Mock data for agency campaigns across multiple advertisers
  const mockCampaigns: Campaign[] = [
    {
      id: "1",
      name: "Summer Sale 2024",
      status: "active",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      budget: 50000,
      spent: 32500,
      advertiserOrganization: { id: "org-1", name: "TechCorp Inc." },
      performance: { impressions: 450000, clicks: 8500, conversions: 185, ctr: 1.89 }
    },
    {
      id: "2",
      name: "Product Launch Q3",
      status: "active",
      startDate: "2024-07-15",
      endDate: "2024-09-30",
      budget: 75000,
      spent: 18750,
      advertiserOrganization: { id: "org-1", name: "TechCorp Inc." },
      performance: { impressions: 320000, clicks: 6400, conversions: 128, ctr: 2.0 }
    },
    {
      id: "3",
      name: "Brand Awareness Drive",
      status: "paused",
      startDate: "2024-05-01",
      endDate: "2024-12-31",
      budget: 100000,
      spent: 45000,
      advertiserOrganization: { id: "org-2", name: "HealthPlus Solutions" },
      performance: { impressions: 680000, clicks: 12200, conversions: 245, ctr: 1.79 }
    },
    {
      id: "4",
      name: "Holiday Shopping Campaign",
      status: "draft",
      startDate: "2024-11-01",
      endDate: "2024-12-25",
      budget: 120000,
      spent: 0,
      advertiserOrganization: { id: "org-3", name: "RetailMax Group" },
      performance: { impressions: 0, clicks: 0, conversions: 0, ctr: 0 }
    },
    {
      id: "5",
      name: "Back to School Special",
      status: "completed",
      startDate: "2024-08-01",
      endDate: "2024-09-15",
      budget: 60000,
      spent: 58500,
      advertiserOrganization: { id: "org-5", name: "EduLearn Academy" },
      performance: { impressions: 520000, clicks: 10400, conversions: 312, ctr: 2.0 }
    }
  ];

  // Mock advertiser organizations under agency management
  const advertiserOrganizations = [
    { id: "org-1", name: "TechCorp Inc." },
    { id: "org-2", name: "HealthPlus Solutions" },
    { id: "org-3", name: "RetailMax Group" },
    { id: "org-4", name: "FinanceFirst Ltd." },
    { id: "org-5", name: "EduLearn Academy" }
  ];

  const getStatusIcon = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "paused":
        return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      case "draft":
        return <FileEdit className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter campaigns based on search term, organization, and status
  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.advertiserOrganization.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = selectedOrganization === "all" || campaign.advertiserOrganization.id === selectedOrganization;
    const matchesStatus = selectedStatus === "all" || campaign.status === selectedStatus;
    
    return matchesSearch && matchesOrg && matchesStatus;
  });

  const totalBudget = filteredCampaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = filteredCampaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalConversions = filteredCampaigns.reduce((sum, campaign) => sum + campaign.performance.conversions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agency Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Manage campaigns across all your advertiser organizations
          </p>
        </div>
        <Link to="/agency-campaigns/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {advertiserOrganizations.length} organizations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${totalSpent.toLocaleString()} spent ({((totalSpent/totalBudget) * 100).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Active campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advertiserOrganizations.length}</div>
            <p className="text-xs text-muted-foreground">
              Under management
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns or organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
              <SelectTrigger className="w-full md:w-[250px] bg-background">
                <SelectValue placeholder="Filter by organization" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="all">All Organizations</SelectItem>
                {advertiserOrganizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px] bg-background">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget / Spent</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No campaigns found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {campaign.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{campaign.advertiserOrganization.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(campaign.status)}
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${campaign.budget.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        ${campaign.spent.toLocaleString()} spent
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{campaign.performance.conversions} conversions</div>
                      <div className="text-muted-foreground">
                        CTR: {campaign.performance.ctr.toFixed(2)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(campaign.startDate).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">
                        to {new Date(campaign.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/agency-campaigns/${campaign.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link to={`/agency-campaigns/${campaign.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AgencyCampaignList;