
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, Users, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const SignupForm: React.FC = () => {
  const { signUp, isSubmitting } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Parse invitation token from URL
  const invitationToken = searchParams.get('invitation');
  let invitationData = null;

  if (invitationToken && invitationToken !== 'true') {
    try {
      invitationData = JSON.parse(atob(invitationToken));
    } catch (error) {
      console.error('Invalid invitation token');
    }
  }
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: invitationData?.email || "",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Check if this is an invitation signup
  const isInvitation = searchParams.get('invitation') === 'true';
  const organizationId = searchParams.get('org');
  const invitedEmail = searchParams.get('email');
  const inviterName = searchParams.get('inviter');

  useEffect(() => {
    if (invitedEmail) {
      setFormData(prev => ({ ...prev, email: decodeURIComponent(invitedEmail) }));
    }
  }, [invitedEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: t("common.error"),
        description: t("auth.emailAndPasswordRequired"),
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t("common.error"),
        description: t("auth.passwordsDoNotMatch"),
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: t("common.error"),
        description: t("auth.passwordTooShort"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmittingForm(true);
      const orgId = invitationData?.organizationId || (organizationId ? parseInt(organizationId) : undefined);
      
      await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        organizationId: orgId,
      });

      // If from invitation, show success message
      if (invitationData) {
        toast({
          title: "Welcome to the platform!",
          description: `You've successfully joined ${invitationData.organizationName} as an affiliate.`,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      // Error is handled in the auth context
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Invitation Banner */}
      {isInvitation && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">You've been invited!</h3>
                <p className="text-sm text-green-700">
                  {inviterName ? `${decodeURIComponent(inviterName)} has invited you` : "You've been invited"} to join an organization.
                  Complete your registration below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              {t("auth.firstName")}
            </label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full"
              disabled={isSubmittingForm}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              {t("auth.lastName")}
            </label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full"
              disabled={isSubmittingForm}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            {t("auth.email")}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full"
            disabled={isSubmittingForm || !!invitedEmail || !!invitationData}
            autoComplete="email"
          />
          {(invitedEmail || invitationData) && (
            <p className="text-xs text-muted-foreground">
              This email was provided in your invitation
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            {t("auth.password")}
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full"
              disabled={isSubmittingForm}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            {t("auth.confirmPassword")}
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full"
              disabled={isSubmittingForm}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-affiliate-primary hover:bg-affiliate-primary/90"
          disabled={isSubmittingForm}
        >
          {isSubmittingForm ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("auth.creatingAccount")}
            </>
          ) : (
            invitationData ? `Join ${invitationData.organizationName}` : 
            isInvitation ? "Join Organization" : t("auth.createAccount")
          )}
        </Button>
      </form>
    </div>
  );
};

export default SignupForm;
