import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BasicInfoData {
  name: string;
  description?: string;
  contactEmail?: string;
}

interface BasicInfoPanelProps {
  data: BasicInfoData;
  onDataChange: (data: BasicInfoData) => void;
  onSave: () => void;
  isSaving: boolean;
  errors?: {
    name?: string;
    description?: string;
    contactEmail?: string;
  };
}

const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ 
  data, 
  onDataChange, 
  onSave, 
  isSaving, 
  errors = {} 
}) => {
  const { t } = useTranslation();

  const handleInputChange = (field: keyof BasicInfoData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onDataChange({
      ...data,
      [field]: e.target.value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {t("organizations.basicInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("organizations.name")}</Label>
          <Input
            id="name"
            value={data.name}
            onChange={handleInputChange('name')}
            placeholder={t("organizations.namePlaceholder")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("organizations.description")}</Label>
          <Textarea
            id="description"
            value={data.description || ''}
            onChange={handleInputChange('description')}
            placeholder={t("organizations.descriptionPlaceholder")}
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">{t("organizations.contactEmail")}</Label>
          <Input
            id="contactEmail"
            type="email"
            value={data.contactEmail || ''}
            onChange={handleInputChange('contactEmail')}
            placeholder={t("organizations.contactEmailPlaceholder")}
          />
          {errors.contactEmail && (
            <p className="text-sm text-destructive">{errors.contactEmail}</p>
          )}
        </div>

        <Button 
          onClick={onSave}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? t("common.saving") : t("common.save")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BasicInfoPanel;