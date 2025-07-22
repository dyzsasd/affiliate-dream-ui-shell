import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
  Loader2
} from "lucide-react";
import { campaignService } from "@/services/campaign";
import { Campaign } from "@/types/api";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

const CampaignList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { toast } = useToast();
  const { organization } = useAuth();

  // Fetch campaigns from backend API
  useEffect(() => {
    if (!organization?.organizationId) {
      setIsLoading(false);
      return;
    }

    const fetchCampaigns = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching campaigns from API for organization:', organization.organizationId);
        const data = await campaignService.getCampaigns(organization.organizationId);
        console.log('Campaigns fetched successfully:', data);
        setCampaigns(data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load campaigns. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [organization?.organizationId, toast]);

  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "paused":
        return <PauseCircle className="h-5 w-5 text-yellow-500" />;
      case "draft":
        return <FileEdit className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("campaigns.noEndDate");
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("campaigns.title")}</h1>
        <Link to="/campaigns/new">
          <Button className="bg-affiliate-primary hover:bg-affiliate-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            {t("campaigns.newCampaign")}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder={t("campaigns.searchCampaigns")}
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          {t("common.filter")}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">{t("campaigns.name")}</TableHead>
                <TableHead>{t("campaigns.status")}</TableHead>
                <TableHead>{t("campaigns.startDate")}</TableHead>
                <TableHead>{t("campaigns.endDate")}</TableHead>
                <TableHead className="text-right">{t("campaigns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {t("campaigns.noCampaigns")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="hover:text-affiliate-primary hover:underline"
                      >
                        {campaign.name}
                      </Link>
                      <p className="text-sm text-gray-500 truncate max-w-[300px]">
                        {campaign.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(campaign.status)}
                        <span className="ml-2 capitalize">{campaign.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(campaign.startDate)}</TableCell>
                    <TableCell>{formatDate(campaign.endDate)}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/campaigns/${campaign.id}`}>
                        <Button variant="ghost" size="sm">
                          {t("common.view")}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default CampaignList;
