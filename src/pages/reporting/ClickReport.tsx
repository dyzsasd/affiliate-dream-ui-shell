import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Globe, Smartphone, Monitor } from "lucide-react";
import { fetchClicksReport, ClicksReportRequest } from "@/services/reportingService";
import { CampaignsApi } from "@/generated-api/src/apis/CampaignsApi";
import { AffiliatesApi } from "@/generated-api/src/apis/AffiliatesApi";
import { createApiClient } from "@/services/backendApi";
import { useAuth } from "@/contexts/auth";

const ClickReport: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("7days");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [affiliateFilter, setAffiliateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"timestamp" | "campaign" | "affiliate">("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;

  // Calculate date range
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (dateRange) {
      case "7days":
        start.setDate(end.getDate() - 7);
        break;
      case "30days":
        start.setDate(end.getDate() - 30);
        break;
      case "90days":
        start.setDate(end.getDate() - 90);
        break;
      case "year":
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 7);
    }
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  // Fetch campaigns for filter
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const api = await createApiClient(CampaignsApi);
      const response = await api.campaignsGet({});
      return response.data || [];
    },
    enabled: !!user
  });

  // Fetch affiliates for filter  
  const { data: affiliates } = useQuery({
    queryKey: ['affiliates'],
    queryFn: async () => {
      const api = await createApiClient(AffiliatesApi);
      // Note: This might need to be adjusted based on your organization structure
      return [];
    },
    enabled: !!user
  });

  // Fetch clicks report
  const { data: clicksResponse, isLoading, error } = useQuery({
    queryKey: ['clicks-report', dateRange, searchTerm, currentPage, campaignFilter, affiliateFilter, sortBy, sortOrder],
    queryFn: () => {
      const { startDate, endDate } = getDateRange();
      const params: ClicksReportRequest = {
        startDate,
        endDate,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        campaignIds: campaignFilter === "all" ? undefined : [campaignFilter],
        affiliateId: affiliateFilter === "all" ? undefined : affiliateFilter,
        sortBy,
        sortOrder
      };
      return fetchClicksReport(params);
    },
    enabled: !!user
  });

  const clicks = clicksResponse?.data || [];
  const pagination = clicksResponse?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: itemsPerPage,
    hasNextPage: false,
    hasPreviousPage: false
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="h-4 w-4 text-blue-500" />;
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Monitor className="h-4 w-4 text-green-500" />;
    }
    return <Monitor className="h-4 w-4 text-gray-500" />;
  };

  // Calculate summary statistics
  const totalClicks = pagination.totalItems;
  const convertedClicks = clicks.filter(c => c.converted).length;
  const conversionRate = totalClicks > 0 ? (convertedClicks / clicks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">{t("reports.clicks.title")}</h1>
        
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
              <SelectValue placeholder="Filter by campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaigns?.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id || ""}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={affiliateFilter} onValueChange={setAffiliateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by affiliate" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Affiliates</SelectItem>
                {affiliates?.map((affiliate) => (
                  <SelectItem key={affiliate.id} value={affiliate.id || ""}>
                    {affiliate.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Clicks</div>
              <div className="text-2xl font-bold">{totalClicks}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Converted Clicks</div>
              <div className="text-2xl font-bold">{convertedClicks}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
              <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Unique Countries</div>
              <div className="text-2xl font-bold">
                {[...new Set(clicks.map(c => c.country))].length}
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Globe className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Clicks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Click Details</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by IP address, country, or referrer..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="timestamp">Date</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="affiliate">Affiliate</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Converted</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Loading clicks...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-destructive">
                      Error loading clicks
                    </TableCell>
                  </TableRow>
                ) : clicks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No clicks found
                    </TableCell>
                  </TableRow>
                ) : (
                  clicks.map((click) => (
                    <TableRow key={click.id}>
                      <TableCell className="font-medium">
                        {formatDate(click.timestamp)}
                      </TableCell>
                      <TableCell>{click.campaignName}</TableCell>
                      <TableCell>{click.affiliateName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{click.country}</div>
                          {(click.region || click.city) && (
                            <div className="text-sm text-muted-foreground">
                              {[click.city, click.region].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getDeviceIcon(click.userAgent)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {click.converted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{click.ipAddress}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> to{" "}
              <span className="font-medium">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> of{" "}
              <span className="font-medium">{pagination.totalItems}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPreviousPage || isLoading}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage || isLoading}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClickReport;