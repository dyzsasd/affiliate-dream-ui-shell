
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
import { cn } from "@/lib/utils";
import { mockPerformanceData, mockCampaigns } from "@/services/api";

const PerformanceReport: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState("today");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data based on screenshots
  const summaryData = {
    clicks: 0,
    uniqueClicks: 0,
    cv: 0,
    event: 0,
    evr: "0%",
    cvr: "0%",
    cpc: "$0.00",
    cost: "$0.00",
    grossSales: "$0.00"
  };

  // Mock detailed data for tables
  const mockConversions = [
    // Empty for "No Record Found" display
  ];

  const mockClicks = [
    // Empty for "No Record Found" display
  ];

  const formattedData: any[] = [];

  const handleRunReport = () => {
    setIsLoading(true);
    // Simulate API call
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
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
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
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground italic">
                          No Record Found
                        </td>
                      </tr>
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
                      <tr>
                        <td colSpan={11} className="px-4 py-12 text-center text-muted-foreground italic">
                          No Record Found
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">0 Total</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">1</span>
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
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground italic">
                          No Record Found
                        </td>
                      </tr>
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
