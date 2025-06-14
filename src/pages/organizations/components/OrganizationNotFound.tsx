
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const OrganizationNotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("organizations.notFound")}</h3>
            <p className="text-muted-foreground">
              {t("organizations.notFoundMessage")}
            </p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/organizations')}
            >
              {t("organizations.backToOrganizations")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationNotFound;
