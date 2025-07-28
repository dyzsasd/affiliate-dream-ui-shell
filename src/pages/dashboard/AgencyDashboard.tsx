import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FilterIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Mock data types
interface AdvertiserOrg {
  id: number;
  name: string;
}

interface CampaignStats {
  id: string;
  name: string;
  advertiserOrgId: number;
  status: 'active' | 'paused' | 'draft';
  clicks: number;
  conversions: number;
  totalCost: number;
}

interface PerformanceStats {
  totalConversions: number;
  totalClicks: number;
  conversionsPerDay: number;
  clicksPerDay: number;
  totalEarnings: number;
}

// Mock data
const mockAdvertiserOrgs: AdvertiserOrg[] = [
  { id: 1, name: "TechCorp Solutions" },
  { id: 2, name: "Digital Marketing Pro" },
  { id: 3, name: "E-commerce Giants" },
  { id: 4, name: "Fashion Forward" },
  { id: 5, name: "Health & Wellness Co." },
];

const mockCampaigns: CampaignStats[] = [
  {
    id: "1",
    name: "Summer Sale Campaign",
    advertiserOrgId: 1,
    status: "active",
    clicks: 15420,
    conversions: 847,
    totalCost: 2450.00,
  },
  {
    id: "2", 
    name: "Brand Awareness Drive",
    advertiserOrgId: 2,
    status: "active",
    clicks: 8930,
    conversions: 456,
    totalCost: 1780.50,
  },
  {
    id: "3",
    name: "Product Launch",
    advertiserOrgId: 3,
    status: "paused",
    clicks: 5620,
    conversions: 234,
    totalCost: 980.75,
  },
  {
    id: "4",
    name: "Holiday Special",
    advertiserOrgId: 1,
    status: "draft",
    clicks: 0,
    conversions: 0,
    totalCost: 0,
  },
  {
    id: "5",
    name: "Fitness Challenge",
    advertiserOrgId: 5,
    status: "active",
    clicks: 12340,
    conversions: 678,
    totalCost: 2100.25,
  },
];

const AgencyDashboard: React.FC = () => {
  const { t } = useTranslation("agencyDashboard");
  
  const [selectedAdvertisers, setSelectedAdvertisers] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'custom'>('7days');
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();

  // Filter campaigns based on selected advertisers
  const filteredCampaigns = useMemo(() => {
    if (selectedAdvertisers.length === 0) return mockCampaigns;
    return mockCampaigns.filter(campaign => 
      selectedAdvertisers.includes(campaign.advertiserOrgId)
    );
  }, [selectedAdvertisers]);

  // Calculate performance stats from filtered campaigns
  const performanceStats: PerformanceStats = useMemo(() => {
    const campaigns = filteredCampaigns;
    const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
    const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
    const totalCost = campaigns.reduce((sum, campaign) => sum + campaign.totalCost, 0);
    
    // Calculate daily averages based on date range
    const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 30;
    
    return {
      totalClicks,
      totalConversions,
      clicksPerDay: Math.round(totalClicks / days),
      conversionsPerDay: Math.round(totalConversions / days),
      totalEarnings: totalCost * 0.15, // Assuming 15% commission
    };
  }, [filteredCampaigns, dateRange]);

  const handleAdvertiserToggle = (advertiserId: number) => {
    setSelectedAdvertisers(prev => 
      prev.includes(advertiserId)
        ? prev.filter(id => id !== advertiserId)
        : [...prev, advertiserId]
    );
  };

  const handleSelectAllAdvertisers = () => {
    if (selectedAdvertisers.length === mockAdvertiserOrgs.length) {
      setSelectedAdvertisers([]);
    } else {
      setSelectedAdvertisers(mockAdvertiserOrgs.map(org => org.id));
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t("agencyDashboard")}</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="w-5 h-5" />
            {t("filters")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Advertiser Organizations Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t("advertiserOrganizations")}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {selectedAdvertisers.length === 0 
                      ? t("selectAdvertisers")
                      : selectedAdvertisers.length === mockAdvertiserOrgs.length
                        ? t("allAdvertisers")
                        : `${selectedAdvertisers.length} selected`
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 pb-2 border-b">
                      <Checkbox
                        id="select-all"
                        checked={selectedAdvertisers.length === mockAdvertiserOrgs.length}
                        onCheckedChange={handleSelectAllAdvertisers}
                      />
                      <label htmlFor="select-all" className="text-sm font-medium">
                        {t("allAdvertisers")}
                      </label>
                    </div>
                    {mockAdvertiserOrgs.map((org) => (
                      <div key={org.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`org-${org.id}`}
                          checked={selectedAdvertisers.includes(org.id)}
                          onCheckedChange={() => handleAdvertiserToggle(org.id)}
                        />
                        <label htmlFor={`org-${org.id}`} className="text-sm">
                          {org.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t("dateRange")}
              </label>
              <div className="flex gap-2">
                <Button
                  variant={dateRange === '7days' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('7days')}
                >
                  {t("last7Days")}
                </Button>
                <Button
                  variant={dateRange === '30days' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange('30days')}
                >
                  {t("last30Days")}
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={dateRange === 'custom' ? 'default' : 'outline'}
                      size="sm"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {t("customRange")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: customDateFrom,
                        to: customDateTo,
                      }}
                      onSelect={(range) => {
                        setCustomDateFrom(range?.from);
                        setCustomDateTo(range?.to);
                        if (range?.from && range?.to) {
                          setDateRange('custom');
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">{t("performanceOverview")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("totalConversions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {performanceStats.totalConversions.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("totalClicks")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {performanceStats.totalClicks.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("conversionsPerDay")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {performanceStats.conversionsPerDay.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("clicksPerDay")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {performanceStats.clicksPerDay.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("totalEarnings")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${performanceStats.totalEarnings.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("campaignsOverview")}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t("noCampaigns")}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("campaignName")}</TableHead>
                  <TableHead>{t("advertiserOrgId")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("clicks")}</TableHead>
                  <TableHead className="text-right">{t("conversions")}</TableHead>
                  <TableHead className="text-right">{t("totalCost")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      {mockAdvertiserOrgs.find(org => org.id === campaign.advertiserOrgId)?.name || campaign.advertiserOrgId}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(campaign.status)}>
                        {t(campaign.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{campaign.conversions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${campaign.totalCost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyDashboard;