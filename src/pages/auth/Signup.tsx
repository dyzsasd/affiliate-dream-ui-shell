
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

const Signup: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-affiliate-primary" />
      </div>
    );
  }

  return (
    <AuthLayout
      title={t("auth.signUp")}
      description={t("auth.createAccountToGetStarted")}
      footerText={t("auth.alreadyHaveAccount")}
      footerLinkText={t("auth.signIn")}
      footerLinkTo="/login"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
