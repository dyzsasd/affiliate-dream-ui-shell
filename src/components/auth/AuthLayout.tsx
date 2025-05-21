
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/common/LanguageSelector";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
  footerText,
  footerLinkText,
  footerLinkTo
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-affiliate-primary">{t("appName")}</h1>
          <p className="mt-2 text-gray-600">{t("appDescription")}</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-600 w-full">
              {footerText}{" "}
              <Link to={footerLinkTo} className="text-affiliate-primary hover:underline">
                {footerLinkText}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
