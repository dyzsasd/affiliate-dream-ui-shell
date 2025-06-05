
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { AffiliatesApi } from "@/generated-api/src/apis";
import { createApiClient } from "@/services/backendApi";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";

const affiliateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactEmail: z.string().email("Valid email is required"),
  status: z.enum(["active", "pending", "inactive", "rejected"]).default("pending"),
  paymentDetails: z.object({
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    paypalEmail: z.string().optional(),
  }).optional(),
});

type AffiliateFormData = z.infer<typeof affiliateSchema>;

const CreateAffiliateAccount: React.FC = () => {
  const { organization } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AffiliateFormData>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      status: "pending",
    },
  });

  const onSubmit = async (data: AffiliateFormData) => {
    if (!organization?.organizationId) {
      toast({
        title: "Error",
        description: "Organization information not found. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const affiliatesApi = await createApiClient(AffiliatesApi);
      
      await affiliatesApi.affiliatesPost({
        request: {
          name: data.name,
          contactEmail: data.contactEmail,
          status: data.status,
          organizationId: organization.organizationId,
          paymentDetails: data.paymentDetails || {},
        },
      });

      toast({
        title: "Success",
        description: "Affiliate account created successfully!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create affiliate account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Affiliate Account</h1>
        <p className="text-muted-foreground">
          Set up your affiliate account to start earning commissions
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Affiliate Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Affiliate Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter affiliate name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register("contactEmail")}
                  placeholder="Enter contact email"
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-500 mt-1">{errors.contactEmail.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setValue("status", value as any)}
                  defaultValue="pending"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Details (Optional)</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    {...register("paymentDetails.bankName")}
                    placeholder="Enter bank name"
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    {...register("paymentDetails.accountNumber")}
                    placeholder="Enter account number"
                  />
                </div>

                <div>
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    {...register("paymentDetails.routingNumber")}
                    placeholder="Enter routing number"
                  />
                </div>

                <div>
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    {...register("paymentDetails.paypalEmail")}
                    placeholder="Enter PayPal email"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Affiliate Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAffiliateAccount;
