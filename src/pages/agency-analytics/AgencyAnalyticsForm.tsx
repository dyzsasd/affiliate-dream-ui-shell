import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

const AgencyAnalyticsForm: React.FC = () => {
  const { t } = useTranslation();
  const { analyticsId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(analyticsId);

  const [formData, setFormData] = useState({
    name: isEditing ? "Campaign Performance Analytics" : "",
    description: isEditing ? "Track campaign ROI, conversion rates, and audience engagement" : "",
    refreshInterval: "60",
    status: "active",
    enableAlerts: true,
    metrics: isEditing ? [
      { id: "1", name: "Revenue Tracking", selectedMetric: "Revenue Tracking", type: "line", enabled: true },
      { id: "2", name: "Conversion Rate", selectedMetric: "Conversion Rate", type: "area", enabled: true },
      { id: "3", name: "Cost Per Acquisition", selectedMetric: "Cost Per Acquisition (CPA)", type: "bar", enabled: false },
      { id: "4", name: "Return on Ad Spend", selectedMetric: "Return on Ad Spend (ROAS)", type: "gauge", enabled: true },
      { id: "5", name: "Market Share", selectedMetric: "Market Share", type: "area", enabled: true }
    ] : []
  });

  // Available market metrics for dropdown selection
  const availableMetrics = [
    "Revenue Tracking",
    "Conversion Rate", 
    "Cost Per Acquisition (CPA)",
    "Return on Ad Spend (ROAS)",
    "Customer Lifetime Value (CLV)",
    "Market Share",
    "Brand Awareness",
    "Click-Through Rate (CTR)",
    "Cost Per Mille (CPM)",
    "Impressions",
    "Engagement Rate",
    "Lead Generation Rate",
    "Customer Acquisition Cost",
    "Attribution Analysis",
    "Audience Demographics",
    "Geographic Performance",
    "Device Performance",
    "Channel Performance",
    "Competitive Analysis",
    "Market Penetration"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMetricToggle = (metricId: string, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.map(metric => 
        metric.id === metricId ? { ...metric, enabled } : metric
      )
    }));
  };

  const addMetric = () => {
    const newMetric = {
      id: Date.now().toString(),
      name: "",
      selectedMetric: "", // For dropdown selection
      type: "line",
      enabled: true
    };
    setFormData(prev => ({
      ...prev,
      metrics: [...prev.metrics, newMetric]
    }));
  };

  const removeMetric = (metricId: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.filter(metric => metric.id !== metricId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    navigate("/agency-analytics");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/agency-analytics">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? t("agencyAnalytics.editAnalytics") : t("agencyAnalytics.createAnalytics")}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? `Edit Analytics Dashboard #${analyticsId}` : "Create a new analytics dashboard"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Dashboard Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter dashboard name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe what this dashboard monitors"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                <Select value={formData.refreshInterval} onValueChange={(value) => handleInputChange("refreshInterval", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="900">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="enableAlerts"
                  checked={formData.enableAlerts}
                  onCheckedChange={(checked) => handleInputChange("enableAlerts", checked)}
                />
                <Label htmlFor="enableAlerts">Enable Alerts</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Configuration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Metrics Configuration</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addMetric}>
              <Plus className="h-4 w-4 mr-2" />
              Add Metric
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.metrics.map((metric) => (
                <div key={metric.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Checkbox
                    checked={metric.enabled}
                    onCheckedChange={(checked) => handleMetricToggle(metric.id, checked as boolean)}
                    className="mt-2"
                  />
                  <div className="flex-1 space-y-4">
                    {/* Metric Selection and Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Select Metric</Label>
                        <Select
                          value={metric.selectedMetric || ""}
                          onValueChange={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              metrics: prev.metrics.map(m => 
                                m.id === metric.id 
                                  ? { ...m, selectedMetric: value, name: value } 
                                  : m
                              )
                            }));
                          }}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Choose a metric" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border z-50">
                            {availableMetrics.map((metricOption) => (
                              <SelectItem key={metricOption} value={metricOption}>
                                {metricOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Custom Name (Optional)</Label>
                        <Input
                          value={metric.name}
                          placeholder="Enter custom metric name"
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              metrics: prev.metrics.map(m => 
                                m.id === metric.id ? { ...m, name: e.target.value } : m
                              )
                            }));
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Chart Type Selection */}
                    <div>
                      <Label className="text-sm font-medium">Chart Type</Label>
                      <Select
                        value={metric.type}
                        onValueChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            metrics: prev.metrics.map(m => 
                              m.id === metric.id ? { ...m, type: value } : m
                            )
                          }));
                        }}
                      >
                        <SelectTrigger className="bg-background max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border z-50">
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="area">Area Chart</SelectItem>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="gauge">Gauge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMetric(metric.id)}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {formData.metrics.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No metrics configured. Click "Add Metric" to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link to="/agency-analytics">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? "Update Dashboard" : "Create Dashboard"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgencyAnalyticsForm;