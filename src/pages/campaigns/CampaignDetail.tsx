
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  PauseCircle,
  FileEdit,
  Clock,
  Calendar,
  Link2,
} from "lucide-react";
import { mockCampaignDetail } from "@/services/api";
import { CampaignDetail as CampaignDetailType, Offer } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

const CampaignDetail: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaign, setCampaign] = useState<CampaignDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API request
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch from API using the campaignId
        // await apiClient.getCampaign(campaignId);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCampaign(mockCampaignDetail);
      } catch (error) {
        console.error("Error fetching campaign:", error);
        toast({
          title: "Error",
          description: "Failed to fetch campaign details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "paused":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <PauseCircle className="mr-1 h-3 w-3" />
            Paused
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <FileEdit className="mr-1 h-3 w-3" />
            Draft
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date set";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-affiliate-primary" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-xl font-semibold mb-2">Campaign not found</h2>
        <p className="text-gray-500 mb-4">The campaign you are looking for does not exist.</p>
        <Link to="/campaigns">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/campaigns">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
        {getStatusBadge(campaign.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{campaign.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Campaign Period</h3>
                  <div className="mt-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p>
                      {campaign.startDate ? formatDate(campaign.startDate) : "No start date"} -{" "}
                      {campaign.endDate ? formatDate(campaign.endDate) : "No end date"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <div className="mt-1 flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <p>{new Date(campaign.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-base font-medium mb-2">Provider Offers</h3>
                <div className="space-y-4">
                  {campaign.offers.map((offer: Offer) => (
                    <div
                      key={offer.id}
                      className="p-4 border border-gray-200 rounded-md hover:border-affiliate-primary transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{offer.name}</h4>
                          <p className="text-sm text-gray-500">{offer.description}</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            offer.payoutType === "CPA"
                              ? "bg-blue-50 text-blue-700"
                              : offer.payoutType === "RevShare"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {offer.payoutType}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-500">Payout:</span>{" "}
                          <span className="font-medium">
                            ${offer.payoutAmount.toFixed(2)} {offer.payoutType === "RevShare" && "%"}
                          </span>
                        </div>
                        <Link to={`/tracking-links?offerId=${offer.id}`}>
                          <Button size="sm" variant="outline" className="h-8">
                            <Link2 className="mr-1 h-4 w-4" />
                            Generate Link
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Clicks</span>
                  <span className="font-medium">1,245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Conversions</span>
                  <span className="font-medium">32</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Conversion Rate</span>
                  <span className="font-medium">2.57%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Revenue</span>
                  <span className="font-medium">$645.00</span>
                </div>

                <Separator className="my-2" />

                <Link to="/reporting">
                  <Button variant="outline" className="w-full">
                    View Full Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to={`/tracking-links?campaignId=${campaign.id}`}>
                  <Button className="w-full bg-affiliate-primary hover:bg-affiliate-primary/90">
                    Generate Tracking Link
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  Edit Campaign
                </Button>
                {campaign.status === "active" ? (
                  <Button variant="outline" className="w-full text-yellow-600">
                    <PauseCircle className="mr-2 h-4 w-4" />
                    Pause Campaign
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full text-green-600">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activate Campaign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
