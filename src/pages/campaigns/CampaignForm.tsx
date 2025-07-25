import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  conversionMethod: z.enum(["server_postback", "pixel"]).optional(),
  sessionDefinition: z.enum(["cookie", "ip", "fingerprint"]).optional(),
  sessionDuration: z.number().min(1).optional(),
  fixedRevenue: z.number().min(0).optional(),
  fixedClickAmount: z.number().min(0).optional(),
  fixedConversionAmount: z.number().min(0).optional(),
  percentageConversionAmount: z.number().min(0).optional(),
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
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditMode = !!id;

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
      conversionMethod: "server_postback",
      sessionDefinition: "cookie",
      sessionDuration: 30,
      fixedRevenue: 0,
      fixedClickAmount: 0,
      fixedConversionAmount: 0,
      percentageConversionAmount: 0,
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

  // Load campaign data when in edit mode
  useEffect(() => {
    const loadCampaignData = async () => {
      if (isEditMode && id) {
        setIsLoading(true);
        try {
          const campaign = await campaignService.getCampaign(id);
          if (campaign) {
            // Convert dates from ISO format to date input format
            const formatDate = (dateString?: string) => {
              if (!dateString) return "";
              return dateString.split('T')[0];
            };

            form.reset({
              name: campaign.name || "",
              description: campaign.description || "",
              status: campaign.status,
              startDate: formatDate(campaign.startDate),
              endDate: formatDate(campaign.endDate),
              destinationUrl: campaign.destinationUrl || "",
              thumbnailUrl: campaign.thumbnailUrl || "",
              previewUrl: campaign.previewUrl || "",
              visibility: (campaign.visibility as "public" | "require_approval" | "private") || "public",
              currencyId: campaign.currencyId || "USD",
              conversionMethod: (campaign.conversionMethod as "server_postback" | "pixel") || "server_postback",
              sessionDefinition: (campaign.sessionDefinition as "cookie" | "ip" | "fingerprint") || "cookie",
              sessionDuration: campaign.sessionDuration || 30,
              fixedRevenue: campaign.fixedRevenue || 0,
              fixedClickAmount: campaign.fixedClickAmount || 0,
              fixedConversionAmount: campaign.fixedConversionAmount || 0,
              percentageConversionAmount: campaign.percentageConversionAmount || 0,
              isCapsEnabled: campaign.isCapsEnabled || false,
              dailyClickCap: campaign.dailyClickCap || 0,
              weeklyClickCap: campaign.weeklyClickCap || 0,
              monthlyClickCap: campaign.monthlyClickCap || 0,
              dailyConversionCap: campaign.dailyConversionCap || 0,
              weeklyConversionCap: campaign.weeklyConversionCap || 0,
              monthlyConversionCap: campaign.monthlyConversionCap || 0,
              globalClickCap: campaign.globalClickCap || 0,
              globalConversionCap: campaign.globalConversionCap || 0,
              termsAndConditions: campaign.termsAndConditions || "",
              internalNotes: campaign.internalNotes || "",
            });
          }
        } catch (error) {
          console.error("Error loading campaign:", error);
          toast({
            title: t("common.error"),
            description: "Failed to load campaign data",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCampaignData();
  }, [isEditMode, id, form, toast, t]);

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
      console.log(`${isEditMode ? 'Updating' : 'Creating'} campaign with data:`, data);
      
      if (isEditMode && id) {
        // Update existing campaign  
        const updateData = {
          name: data.name,
          description: data.description,
          status: data.status === "archived" ? "paused" : data.status as "draft" | "active" | "paused",
          startDate: data.startDate,
          endDate: data.endDate,
          destinationUrl: data.destinationUrl,
          thumbnailUrl: data.thumbnailUrl,
          previewUrl: data.previewUrl,
          visibility: data.visibility,
          currencyId: data.currencyId,
          conversionMethod: data.conversionMethod,
          sessionDefinition: data.sessionDefinition,
          sessionDuration: data.sessionDuration,
          fixedRevenue: data.fixedRevenue,
          fixedClickAmount: data.fixedClickAmount,
          fixedConversionAmount: data.fixedConversionAmount,
          percentageConversionAmount: data.percentageConversionAmount,
          isCapsEnabled: data.isCapsEnabled,
          dailyClickCap: data.dailyClickCap,
          weeklyClickCap: data.weeklyClickCap,
          monthlyClickCap: data.monthlyClickCap,
          dailyConversionCap: data.dailyConversionCap,
          weeklyConversionCap: data.weeklyConversionCap,
          monthlyConversionCap: data.monthlyConversionCap,
          globalClickCap: data.globalClickCap,
          globalConversionCap: data.globalConversionCap,
          termsAndConditions: data.termsAndConditions,
          internalNotes: data.internalNotes,
        };
        
        const campaign = await campaignService.updateCampaign(id, updateData);
        console.log("Campaign updated successfully:", campaign);
        
        toast({
          title: t("campaigns.updateSuccess"),
          description: t("campaigns.updateSuccessDescription"),
        });
        
        // Navigate to the campaign detail page
        navigate(`/campaigns/${id}`);
      } else {
        // Create new campaign
        // Convert date strings to proper datetime format with timezone
        const formatDateTime = (dateString?: string) => {
          if (!dateString) return undefined;
          // Add time and timezone to make it a valid datetime
          return `${dateString}T00:00:00Z`;
        };
        
        // Create the request object matching the backend API structure
        const request: ModelsCreateCampaignRequest = {
          name: data.name,
          organizationId: organization.organizationId,
          advertiserId: 1, // Default for now - should be selected/configured
          status: data.status as ModelsCreateCampaignRequest['status'],
          description: data.description || undefined,
          startDate: formatDateTime(data.startDate),
          endDate: formatDateTime(data.endDate),
          destinationUrl: data.destinationUrl || undefined,
          thumbnailUrl: data.thumbnailUrl || undefined,
          previewUrl: data.previewUrl || undefined,
          visibility: data.visibility as ModelsCreateCampaignRequest['visibility'],
          currencyId: data.currencyId || undefined,
          fixedRevenue: data.fixedRevenue || undefined,
          fixedClickAmount: data.fixedClickAmount || undefined,
          fixedConversionAmount: data.fixedConversionAmount || undefined,
          percentageConversionAmount: data.percentageConversionAmount || undefined,
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
      }
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

  if (isLoading) {
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
          <h1 className="text-2xl font-bold tracking-tight">
            {t("campaigns.editCampaign")}
          </h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t("common.loading")}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode ? t("campaigns.editCampaign") : t("campaigns.createNew")}
        </h1>
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
                <h3 className="text-lg font-semibold mb-4">{t("campaigns.campaignUrls")}</h3>
                <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="destinationUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("campaigns.destinationUrlLabel")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("campaigns.destinationUrlPlaceholder")} {...field} />
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
                            <FormLabel>{t("campaigns.thumbnailUrlLabel")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("campaigns.thumbnailUrlPlaceholder")} {...field} />
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
                            <FormLabel>{t("campaigns.previewUrlLabel")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("campaigns.previewUrlPlaceholder")} {...field} />
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
                <h3 className="text-lg font-semibold mb-4">{t("campaigns.payoutRevenueConfiguration")}</h3>
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="currencyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("campaigns.currencyLabel")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("campaigns.selectCurrency")} />
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
                        name="visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("campaigns.visibilityLabel")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("campaigns.selectVisibilityPlaceholder")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="public">{t("campaigns.visibilityPublic")}</SelectItem>
                                <SelectItem value="require_approval">Require Approval</SelectItem>
                                <SelectItem value="private">{t("campaigns.visibilityPrivate")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">{t("campaigns.revenueLabel")}</h4>
                    <FormField
                      control={form.control}
                      name="fixedRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("campaigns.fixedRevenueLabel")}</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder={t("campaigns.fixedRevenuePlaceholder")}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="font-medium">{t("campaigns.clickBasedPayout")}</h4>
                      <FormField
                        control={form.control}
                        name="fixedClickAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("campaigns.fixedClickAmountLabel")}</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder={t("campaigns.fixedClickAmountPlaceholder")}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">{t("campaigns.conversionBasedPayout")}</h4>
                      <FormField
                        control={form.control}
                        name="fixedConversionAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("campaigns.fixedConversionAmountLabel")}</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder={t("campaigns.fixedConversionAmountPlaceholder")}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="percentageConversionAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("campaigns.percentageConversionAmountLabel")}</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder={t("campaigns.percentageConversionAmountPlaceholder")}
                                value={field.value || ''}
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

              {/* Tracking Configuration */}
              <Card className="p-4 bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">{t("campaigns.trackingConfiguration")}</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="conversionMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("campaigns.conversionMethodLabel")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("campaigns.selectMethodPlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="server_postback">{t("campaigns.serverPostback")}</SelectItem>
                            <SelectItem value="pixel">{t("campaigns.pixel")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sessionDefinition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("campaigns.sessionDefinitionLabel")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("campaigns.selectDefinitionPlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cookie">{t("campaigns.cookie")}</SelectItem>
                            <SelectItem value="ip">{t("campaigns.ip")}</SelectItem>
                            <SelectItem value="fingerprint">{t("campaigns.fingerprint")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sessionDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("campaigns.sessionDurationLabel")}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              {/* Additional Information */}
              <Card className="p-4 bg-muted/50">
                <h3 className="text-lg font-semibold mb-4">{t("campaigns.additionalInformation")}</h3>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="termsAndConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("campaigns.termsAndConditionsLabel")}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t("campaigns.termsAndConditionsPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="internalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("campaigns.internalNotesLabel")}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t("campaigns.internalNotesPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                <Button type="submit" disabled={isSubmitting || isLoading}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? t("campaigns.updating") : t("campaigns.creating")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditMode ? t("campaigns.update") : t("campaigns.create")}
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