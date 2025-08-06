import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Save, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const AgencyCampaignForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEditing = Boolean(id);

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [formData, setFormData] = useState({
    name: isEditing ? "Summer Sale 2024" : "",
    description: isEditing ? "Comprehensive summer marketing campaign targeting seasonal buyers" : "",
    advertiserOrganizationId: isEditing ? "org-1" : "",
    budget: isEditing ? "50000" : "",
    dailyBudget: isEditing ? "1600" : "",
    status: isEditing ? "active" : "draft",
    objectives: isEditing ? "brand_awareness,lead_generation" : "",
    targetAudience: isEditing ? "Adults aged 25-45, interested in summer products" : "",
    channels: isEditing ? "facebook,google,instagram" : ""
  });

  // Mock advertiser organizations under agency management
  const advertiserOrganizations = [
    { id: "org-1", name: "TechCorp Inc." },
    { id: "org-2", name: "HealthPlus Solutions" },
    { id: "org-3", name: "RetailMax Group" },
    { id: "org-4", name: "FinanceFirst Ltd." },
    { id: "org-5", name: "EduLearn Academy" }
  ];

  const campaignObjectives = [
    { value: "brand_awareness", label: "Brand Awareness" },
    { value: "lead_generation", label: "Lead Generation" },
    { value: "sales", label: "Sales/Conversions" },
    { value: "traffic", label: "Website Traffic" },
    { value: "engagement", label: "Engagement" },
    { value: "app_installs", label: "App Installs" }
  ];

  const marketingChannels = [
    { value: "facebook", label: "Facebook Ads" },
    { value: "google", label: "Google Ads" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter/X" },
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "YouTube" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.advertiserOrganizationId || !formData.budget || !startDate || !endDate) {
      alert("Please fill in all required fields");
      return;
    }

    // Handle form submission
    const campaignData = {
      ...formData,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      budget: parseFloat(formData.budget),
      dailyBudget: parseFloat(formData.dailyBudget || "0")
    };
    
    console.log("Campaign submitted:", campaignData);
    navigate("/agency-campaigns");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/agency-campaigns">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "Edit Campaign" : "Create New Campaign"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? `Editing campaign #${id}` : "Create a campaign for one of your advertiser organizations"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Advertiser Organization Selection */}
            <div>
              <Label htmlFor="advertiserOrganization">
                Advertiser Organization <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.advertiserOrganizationId} onValueChange={(value) => handleInputChange("advertiserOrganizationId", value)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select the organization this campaign is for" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {advertiserOrganizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">
                  Campaign Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter campaign name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Campaign Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Campaign Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the campaign goals and strategy"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                placeholder="Describe the target audience demographics and interests"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Budget & Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">
                  Total Budget ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  placeholder="Enter total campaign budget"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dailyBudget">Daily Budget ($)</Label>
                <Input
                  id="dailyBudget"
                  type="number"
                  value={formData.dailyBudget}
                  onChange={(e) => handleInputChange("dailyBudget", e.target.value)}
                  placeholder="Optional daily spending limit"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Strategy */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="objectives">Campaign Objectives</Label>
              <Select value={formData.objectives} onValueChange={(value) => handleInputChange("objectives", value)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select primary campaign objective" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {campaignObjectives.map((objective) => (
                    <SelectItem key={objective.value} value={objective.value}>
                      {objective.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="channels">Marketing Channels</Label>
              <Select value={formData.channels} onValueChange={(value) => handleInputChange("channels", value)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select primary marketing channels" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {marketingChannels.map((channel) => (
                    <SelectItem key={channel.value} value={channel.value}>
                      {channel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link to="/agency-campaigns">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Update Campaign" : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgencyCampaignForm;