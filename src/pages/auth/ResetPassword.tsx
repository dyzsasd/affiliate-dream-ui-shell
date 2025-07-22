import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const ResetPassword: React.FC = () => {
  const { isLoading } = useAuth();
  const { t } = useTranslation();

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
      description={t("auth.resetPasswordDescription")}
      footerText={t("auth.rememberPassword")}
      footerLinkText={t("auth.signIn")}
      footerLinkTo="/login"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;