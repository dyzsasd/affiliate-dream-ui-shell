import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { campaignService } from "@/services/campaign";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/auth";
import { ModelsCreateCampaignRequest } from "@/generated-api/src/models/ModelsCreateCampaignRequest";

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "paused", "archived"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  destinationUrl: z.string().url().optional().or(z.literal("")),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  previewUrl: z.string().url().optional().or(z.literal("")),
  visibility: z.enum(["public", "require_approval", "private"]).optional(),
  currencyId: z.string().optional(),
  billingModel: z.enum(["click", "conversion"]).optional(),
  payoutStructure: z.enum(["fixed", "percentage"]).optional(),
  payoutAmount: z.number().min(0).optional(),
  revenueStructure: z.enum(["fixed", "percentage"]).optional(),
  revenueAmount: z.number().min(0).optional(),
  conversionMethod: z.enum(["server_postback", "pixel"]).optional(),
  sessionDefinition: z.enum(["cookie", "ip", "fingerprint"]).optional(),
  sessionDuration: z.number().min(1).optional(),
  isCapsEnabled: z.boolean().optional(),
  dailyClickCap: z.number().min(0).optional(),
  weeklyClickCap: z.number().min(0).optional(),
  monthlyClickCap: z.number().min(0).optional(),
  dailyConversionCap: z.number().min(0).optional(),
  weeklyConversionCap: z.number().min(0).optional(),
  monthlyConversionCap: z.number().min(0).optional(),
  globalClickCap: z.number().min(0).optional(),
  globalConversionCap: z.number().min(0).optional(),
  termsAndConditions: z.string().optional(),
  internalNotes: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

const CampaignForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { organization } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "draft",
      startDate: "",
      endDate: "",
      destinationUrl: "",
      thumbnailUrl: "",
      previewUrl: "",
      visibility: "public",
      currencyId: "USD",
      billingModel: "conversion",
      payoutStructure: "fixed",
      payoutAmount: 0,
      revenueStructure: "fixed", 
      revenueAmount: 0,
      conversionMethod: "server_postback",
      sessionDefinition: "cookie",
      sessionDuration: 30,
      isCapsEnabled: false,
      dailyClickCap: 0,
      weeklyClickCap: 0,
      monthlyClickCap: 0,
      dailyConversionCap: 0,
      weeklyConversionCap: 0,
      monthlyConversionCap: 0,
      globalClickCap: 0,
      globalConversionCap: 0,
      termsAndConditions: "",
      internalNotes: "",
    },
  });

  const onSubmit = async (data: CampaignFormData) => {
    if (!organization?.organizationId) {
      toast({
        title: t("common.error"),
        description: "No organization found. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Creating campaign with data:", data);
      
      // Create the request object matching the backend API structure
      const request: ModelsCreateCampaignRequest = {
        name: data.name,
        organizationId: organization.organizationId,
        advertiserId: 1, // Default for now - should be selected/configured
        status: data.status as ModelsCreateCampaignRequest['status'],
        description: data.description || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        destinationUrl: data.destinationUrl || undefined,
        thumbnailUrl: data.thumbnailUrl || undefined,
        previewUrl: data.previewUrl || undefined,
        visibility: data.visibility as ModelsCreateCampaignRequest['visibility'],
        currencyId: data.currencyId || undefined,
        billingModel: data.billingModel as ModelsCreateCampaignRequest['billingModel'],
        payoutStructure: data.payoutStructure as ModelsCreateCampaignRequest['payoutStructure'],
        payoutAmount: data.payoutAmount || undefined,
        revenueStructure: data.revenueStructure as ModelsCreateCampaignRequest['revenueStructure'],
        revenueAmount: data.revenueAmount || undefined,
        conversionMethod: data.conversionMethod as ModelsCreateCampaignRequest['conversionMethod'],
        sessionDefinition: data.sessionDefinition as ModelsCreateCampaignRequest['sessionDefinition'],
        sessionDuration: data.sessionDuration || undefined,
        isCapsEnabled: data.isCapsEnabled || false,
        dailyClickCap: data.dailyClickCap || undefined,
        weeklyClickCap: data.weeklyClickCap || undefined,
        monthlyClickCap: data.monthlyClickCap || undefined,
        dailyConversionCap: data.dailyConversionCap || undefined,
        weeklyConversionCap: data.weeklyConversionCap || undefined,
        monthlyConversionCap: data.monthlyConversionCap || undefined,
        globalClickCap: data.globalClickCap || undefined,
        globalConversionCap: data.globalConversionCap || undefined,
        termsAndConditions: data.termsAndConditions || undefined,
        internalNotes: data.internalNotes || undefined,
      };
      
      const campaign = await campaignService.createCampaignFromRequest(request);
      console.log("Campaign created successfully:", campaign);
      
      toast({
        title: t("campaigns.createSuccess"),
        description: t("campaigns.createSuccessDescription"),
      });
      
      // Navigate to the campaign detail page
      navigate(`/campaigns/${campaign.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: t("common.error"),
        description: t("campaigns.createError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/campaigns")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{t("campaigns.createNew")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("campaigns.campaignDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("campaigns.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("campaigns.namePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("campaigns.status")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("campaigns.selectStatus")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">{t("campaigns.statusDraft")}</SelectItem>
                          <SelectItem value="active">{t("campaigns.statusActive")}</SelectItem>
                          <SelectItem value="paused">{t("campaigns.statusPaused")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("campaigns.description")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("campaigns.descriptionPlaceholder")} 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("campaigns.startDate")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("campaigns.endDate")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* URLs Section */}
              <Card className="p-4 bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Campaign URLs</h3>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="destinationUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/landing" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="thumbnailUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thumbnail URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/thumb.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="previewUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preview URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/preview.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>

              {/* Payout & Revenue Section */}
              <Card className="p-4 bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">Payout & Revenue Configuration</h3>
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="currencyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="billingModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Model</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select billing model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="click">Click</SelectItem>
                              <SelectItem value="conversion">Conversion</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visibility</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select visibility" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="require_approval">Require Approval</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="font-medium">Payout Configuration</h4>
                      <FormField
                        control={form.control}
                        name="payoutStructure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payout Structure</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payout structure" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed</SelectItem>
                                <SelectItem value="percentage">Percentage</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="payoutAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payout Amount</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Revenue Configuration</h4>
                      <FormField
                        control={form.control}
                        name="revenueStructure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Revenue Structure</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select revenue structure" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed</SelectItem>
                                <SelectItem value="percentage">Percentage</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="revenueAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Revenue Amount</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/campaigns")}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("campaigns.creating")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t("campaigns.create")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignForm;