import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ResetPassword: React.FC = () => {
  const { isLoading } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for error parameters in URL hash
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    const error = params.get('error');
    const errorCode = params.get('error_code');
    const errorDescription = params.get('error_description');
    
    if (error && errorCode) {
      if (errorCode === 'otp_expired') {
        setErrorMessage(t("auth.resetLinkExpired"));
      } else if (error === 'access_denied') {
        setErrorMessage(t("auth.resetLinkInvalid"));
      } else {
        setErrorMessage(errorDescription || t("auth.resetError"));
      }
      
      // Clean the URL
      navigate('/reset-password', { replace: true });
    }
  }, [navigate, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-affiliate-primary" />
      </div>
    );
  }

  return (
    <AuthLayout
      title={t("auth.resetPassword")}
      description={errorMessage ? t("auth.resetPasswordErrorDescription") : t("auth.resetPasswordDescription")}
      footerText={t("auth.rememberPassword")}
      footerLinkText={t("auth.signIn")}
      footerLinkTo="/login"
    >
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;