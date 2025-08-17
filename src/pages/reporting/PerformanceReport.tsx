
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { Calendar, Filter, RefreshCw, ChevronDown, Search, CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { 
  fetchPerformanceSummary, 
  fetchPerformanceTimeSeries, 
  fetchDailyReport, 
  fetchConversionsReport, 
  fetchClicksReport,
  mockPerformanceSummary,
  mockDailyReport,
  PerformanceSummaryRequest,
  PerformanceTimeSeriesRequest,
  DailyReportRequest,
  ConversionsReportRequest,
  ClicksReportRequest
} from "@/services/reportingService";

const PerformanceReport: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState("today");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Prepare API request parameters
  const getApiParams = () => ({
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
  });

  // Fetch performance summary
  const { data: summaryResponse, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['performance-summary', startDate, endDate],
    queryFn: () => fetchPerformanceSummary(getApiParams()),
    enabled: !!startDate && !!endDate,
    placeholderData: mockPerformanceSummary,
  });

  // Fetch performance time series for chart
  const { data: timeSeriesResponse, isLoading: isLoadingTimeSeries } = useQuery({
    queryKey: ['performance-timeseries', startDate, endDate],
    queryFn: () => fetchPerformanceTimeSeries(getApiParams()),
    enabled: !!startDate && !!endDate,
    placeholderData: { data: [], status: "success" as const },
  });

  // Fetch daily report
  const { data: dailyReportResponse, isLoading: isLoadingDaily } = useQuery({
    queryKey: ['daily-report', startDate, endDate, searchTerm],
    queryFn: () => fetchDailyReport({ 
      ...getApiParams(), 
      search: searchTerm || undefined,
      page: 1,
      limit: 50
    }),
    enabled: !!startDate && !!endDate,
    placeholderData: mockDailyReport,
  });

  // Fetch conversions report
  const { data: conversionsResponse, isLoading: isLoadingConversions } = useQuery({
    queryKey: ['conversions-report', startDate, endDate, searchTerm],
    queryFn: () => fetchConversionsReport({ 
      ...getApiParams(), 
      search: searchTerm || undefined,
      page: 1,
      limit: 50
    }),
    enabled: !!startDate && !!endDate,
    placeholderData: { data: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10, hasNextPage: false, hasPreviousPage: false }, status: "success" as const },
  });

  // Fetch clicks report
  const { data: clicksResponse, isLoading: isLoadingClicks } = useQuery({
    queryKey: ['clicks-report', startDate, endDate, searchTerm],
    queryFn: () => fetchClicksReport({ 
      ...getApiParams(), 
      search: searchTerm || undefined,
      page: 1,
      limit: 50
    }),
    enabled: !!startDate && !!endDate,
    placeholderData: { data: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10, hasNextPage: false, hasPreviousPage: false }, status: "success" as const },
  });

  // Extract data with fallbacks
  const summaryData = {
    clicks: summaryResponse?.data?.totalClicks || 0,
    uniqueClicks: summaryResponse?.data?.totalClicks || 0,
    cv: summaryResponse?.data?.totalConversions || 0,
    event: 0,
    evr: "0%",
    cvr: `${summaryResponse?.data?.conversionRate || 0}%`,
    cpc: "$0.00",
    cost: `$${summaryResponse?.data?.totalRevenue || 0}`,
    grossSales: `$${summaryResponse?.data?.totalRevenue || 0}`
  };

  const formattedData = timeSeriesResponse?.data || [];
  const conversionsData = conversionsResponse?.data || [];
  const clicksData = clicksResponse?.data || [];
  const dailyData = dailyReportResponse?.data || [];

  const handleRunReport = () => {
    setIsLoading(true);
    // Trigger refetch of all queries
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{t("reports.title")}</span>
          <span>/</span>
          <span>{t("reports.performance.title")}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{t("reports.performance.title")}</h1>
      </div>

      {/* Date Range and Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Date Range Picker */}
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "MM/dd/yyyy") : <span>Start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "MM/dd/yyyy") : <span>End date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Add Filter Button */}
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Add Filter</span>
        </Button>

        <div className="ml-auto flex items-center space-x-2">
          <Button variant="outline" size="sm">Clear</Button>
          <Button 
            onClick={handleRunReport}
            disabled={isLoading || isLoadingSummary || isLoadingTimeSeries || isLoadingDaily}
            size="sm"
          >
            {(isLoading || isLoadingSummary || isLoadingTimeSeries || isLoadingDaily) ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running Report...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Report
              </>
            )}
          </Button>
        </div>
      </div>

      
      {/* Summary Section */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center space-x-2 text-lg font-medium mb-4">
          <ChevronDown className="h-4 w-4" />
          <span>Summary</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-9 mb-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">CLICKS</div>
              <div className="text-2xl font-bold">{summaryData.clicks}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">UNIQUE CLICKS</div>
              <div className="text-2xl font-bold">{summaryData.uniqueClicks}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">CV</div>
              <div className="text-2xl font-bold">{summaryData.cv}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">EVENT</div>
              <div className="text-2xl font-bold">{summaryData.event}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">EVR</div>
              <div className="text-2xl font-bold">{summaryData.evr}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">CVR</div>
              <div className="text-2xl font-bold">{summaryData.cvr}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">CPC</div>
              <div className="text-2xl font-bold">{summaryData.cpc}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">COST</div>
              <div className="text-2xl font-bold">{summaryData.cost}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">GROSS SALES</div>
            <div className="text-2xl font-bold">{summaryData.grossSales}</div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Performance Graph */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center space-x-2 text-lg font-medium mb-4">
          <ChevronDown className="h-4 w-4" />
          <span>Performance Graph</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-6">
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
                      dataKey="clicks"
                      name="Clicks"
                      stroke="#4338ca"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="conversions"
                      name="Conversions"
                      stroke="#059669"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Detailed Report Tabs */}
      <div className="space-y-6">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily Report</TabsTrigger>
            <TabsTrigger value="conversions">Conversion Report</TabsTrigger>
            <TabsTrigger value="clicks">Click Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Detailed Report</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80"
                  />
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Date</th>
                        <th className="h-10 px-4 text-right font-medium">Clicks</th>
                        <th className="h-10 px-4 text-right font-medium">Unique Clicks</th>
                        <th className="h-10 px-4 text-right font-medium">CV</th>
                        <th className="h-10 px-4 text-right font-medium">CVR</th>
                        <th className="h-10 px-4 text-right font-medium">CPC</th>
                        <th className="h-10 px-4 text-right font-medium">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyData.length > 0 ? (
                        dailyData.map((row, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">{row.date}</td>
                            <td className="px-4 py-2 text-right">{row.clicks}</td>
                            <td className="px-4 py-2 text-right">{row.clicks}</td>
                            <td className="px-4 py-2 text-right">{row.conversions}</td>
                            <td className="px-4 py-2 text-right">{row.conversionRate.toFixed(2)}%</td>
                            <td className="px-4 py-2 text-right">$0.00</td>
                            <td className="px-4 py-2 text-right">${row.revenue.toFixed(2)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground italic">
                            No Record Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Detailed Report</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80"
                  />
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Date</th>
                        <th className="h-10 px-4 text-left font-medium">Click Date</th>
                        <th className="h-10 px-4 text-left font-medium">Delta</th>
                        <th className="h-10 px-4 text-left font-medium">Offer</th>
                        <th className="h-10 px-4 text-left font-medium">Partner ID</th>
                        <th className="h-10 px-4 text-right font-medium">Cost</th>
                        <th className="h-10 px-4 text-left font-medium">Conversion IP</th>
                        <th className="h-10 px-4 text-left font-medium">Session IP</th>
                        <th className="h-10 px-4 text-left font-medium">Transaction ID</th>
                        <th className="h-10 px-4 text-left font-medium">Offer Events</th>
                        <th className="h-10 px-4 text-left font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionsData.length > 0 ? (
                        conversionsData.map((conversion) => (
                          <tr key={conversion.id}>
                            <td className="px-4 py-2">{new Date(conversion.timestamp).toLocaleDateString()}</td>
                            <td className="px-4 py-2">-</td>
                            <td className="px-4 py-2">-</td>
                            <td className="px-4 py-2">{conversion.offerName}</td>
                            <td className="px-4 py-2">{conversion.affiliateId}</td>
                            <td className="px-4 py-2 text-right">${conversion.payout.toFixed(2)}</td>
                            <td className="px-4 py-2">-</td>
                            <td className="px-4 py-2">-</td>
                            <td className="px-4 py-2">{conversion.transactionId}</td>
                            <td className="px-4 py-2">-</td>
                            <td className="px-4 py-2">{conversion.status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={11} className="px-4 py-12 text-center text-muted-foreground italic">
                            No Record Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    {conversionsResponse?.pagination?.totalItems || 0} Total
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {conversionsResponse?.pagination?.currentPage || 1}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clicks" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Detailed Report</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80"
                  />
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">Date</th>
                        <th className="h-10 px-4 text-left font-medium">Offer</th>
                        <th className="h-10 px-4 text-left font-medium">Partner ID</th>
                        <th className="h-10 px-4 text-right font-medium">Cost</th>
                        <th className="h-10 px-4 text-left font-medium">Country</th>
                        <th className="h-10 px-4 text-left font-medium">IP Address</th>
                        <th className="h-10 px-4 text-left font-medium">Transaction ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clicksData.length > 0 ? (
                        clicksData.map((click) => (
                          <tr key={click.id}>
                            <td className="px-4 py-2">{new Date(click.timestamp).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{click.offerName}</td>
                            <td className="px-4 py-2">{click.affiliateId}</td>
                            <td className="px-4 py-2 text-right">$0.00</td>
                            <td className="px-4 py-2">{click.country}</td>
                            <td className="px-4 py-2">{click.ipAddress}</td>
                            <td className="px-4 py-2">{click.id}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground italic">
                            No Record Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PerformanceReport;
