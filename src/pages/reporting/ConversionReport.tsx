
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { CheckCircle2, XCircle, Clock, Search } from "lucide-react";
import { mockConversions, mockPaginatedConversions } from "@/services/api";
import { Conversion } from "@/types/api";

const ConversionReport: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState("7days");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [conversions, setConversions] = useState<Conversion[]>(mockConversions);
  const [totalPages, setTotalPages] = useState(mockPaginatedConversions.meta.totalPages);

  // Apply filters
  const filteredConversions = conversions.filter((conversion) => {
    // Filter by status
    if (statusFilter !== "all" && conversion.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term in transaction ID
    if (searchTerm && !conversion.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Calculate summary statistics
  const approvedConversions = filteredConversions.filter(c => c.status === "approved");
  const pendingConversions = filteredConversions.filter(c => c.status === "pending");
  const rejectedConversions = filteredConversions.filter(c => c.status === "rejected");
  
  const totalPayout = approvedConversions.reduce((sum, c) => sum + c.payout, 0);
  const pendingPayout = pendingConversions.reduce((sum, c) => sum + c.payout, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">{t("reports.conversions.title")}</h1>
        
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
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">{t("reports.conversions.approved")}</SelectItem>
                <SelectItem value="pending">{t("reports.conversions.pending")}</SelectItem>
                <SelectItem value="rejected">{t("reports.conversions.rejected")}</SelectItem>
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
              <div className="text-sm text-gray-500">{t("reports.conversions.totalConversions")}</div>
              <div className="text-2xl font-bold">{filteredConversions.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">{t("reports.conversions.approved")}</div>
              <div className="text-2xl font-bold">{approvedConversions.length}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">{t("reports.conversions.pending")}</div>
              <div className="text-2xl font-bold">{pendingConversions.length}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">{t("reports.conversions.rejected")}</div>
              <div className="text-2xl font-bold">{rejectedConversions.length}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Earnings Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("reports.conversions.earningsSummary")}</CardTitle>
            <CardDescription>{t("reports.conversions.approvedAndPendingPayouts")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">{t("reports.conversions.approvedPayouts")}</span>
                <span className="font-semibold text-green-600">${totalPayout.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("reports.conversions.pendingPayouts")}</span>
                <span className="font-semibold text-yellow-600">${pendingPayout.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t("reports.conversions.totalPotential")}</span>
                <span className="font-bold">${(totalPayout + pendingPayout).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("reports.conversions.conversionRate")}</CardTitle>
            <CardDescription>{t("reports.conversions.approvalRateOverTime")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-sm">{t("reports.conversions.approvalRate")}</span>
                  <div className="font-semibold text-xl">
                    {filteredConversions.length > 0 
                      ? `${((approvedConversions.length / filteredConversions.length) * 100).toFixed(1)}%`
                      : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm">{t("reports.conversions.rejectionRate")}</span>
                  <div className="font-semibold text-xl">
                    {filteredConversions.length > 0
                      ? `${((rejectedConversions.length / filteredConversions.length) * 100).toFixed(1)}%`
                      : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm">{t("reports.conversions.pendingRate")}</span>
                  <div className="font-semibold text-xl">
                    {filteredConversions.length > 0
                      ? `${((pendingConversions.length / filteredConversions.length) * 100).toFixed(1)}%`
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Conversions Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("reports.conversions.conversionDetails")}</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder={t("reports.conversions.searchByTransactionId")}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("reports.conversions.dateTime")}</TableHead>
                  <TableHead>{t("reports.conversions.transactionId")}</TableHead>
                  <TableHead>{t("reports.conversions.campaign")}</TableHead>
                  <TableHead>{t("reports.conversions.status")}</TableHead>
                  <TableHead className="text-right">{t("reports.conversions.payout")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {t("reports.conversions.noConversionsFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredConversions.map((conversion) => (
                    <TableRow key={conversion.id}>
                      <TableCell className="font-medium">
                        {formatDate(conversion.timestamp)}
                      </TableCell>
                      <TableCell>{conversion.transactionId}</TableCell>
                      <TableCell>
                        {conversion.campaignId === "1" ? "Summer Promotion" : 
                         conversion.campaignId === "2" ? "Black Friday" :
                         conversion.campaignId === "3" ? "Premium Subscription" : conversion.campaignId}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(conversion.status)}
                          <span className="ml-1 capitalize">{conversion.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ${conversion.payout.toFixed(2)} {conversion.currency}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-gray-500">
              {t("reports.conversions.showingResults")} <span className="font-medium">{Math.min(1, filteredConversions.length)}</span> {t("reports.conversions.to")}{" "}
              <span className="font-medium">{Math.min(10, filteredConversions.length)}</span> {t("reports.conversions.of")}{" "}
              <span className="font-medium">{filteredConversions.length}</span> {t("reports.conversions.results")}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                {t("reports.conversions.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                {t("reports.conversions.next")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionReport;
