
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import { OrganizationsApi } from "@/generated-api/src/apis/OrganizationsApi";
import { DomainOrganizationWithExtraInfo } from "@/generated-api/src/models";
import { createApiClient } from "@/services/backendApi";
import { useTranslation } from "react-i18next";
import OrganizationHeader from "./components/OrganizationHeader";
import OrganizationDetailsForm from "./components/OrganizationDetailsForm";
import InvitationManager from "./components/InvitationManager";
import OrganizationNotFound from "./components/OrganizationNotFound";
import OrganizationLoadingState from "./components/OrganizationLoadingState";

const OrganizationEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [organization, setOrganization] = useState<DomainOrganizationWithExtraInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: ""
  });

  useEffect(() => {
    if (id) {
      fetchOrganization();
    }
  }, [id]);

  const fetchOrganization = async () => {
    try {
      setIsLoading(true);
      const organizationsApi = await createApiClient(OrganizationsApi);
      const data = await organizationsApi.organizationsIdGet({
        id: parseInt(id!),
        withExtra: true
      }) as DomainOrganizationWithExtraInfo;
      setOrganization(data);
      setFormData({
        name: data.name || "",
        type: data.type || ""
      });
    } catch (error) {
      console.error('Error fetching organization:', error);
      toast({
        title: t("common.error"),
        description: t("organizations.fetchError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const organizationsApi = await createApiClient(OrganizationsApi);
      const updatedOrg = await organizationsApi.organizationsIdPut({
        id: parseInt(id!),
        request: {
          name: formData.name,
          type: formData.type as any
        }
      });
      
      setOrganization(updatedOrg);
      toast({
        title: t("common.save"),
        description: t("organizations.updateSuccess"),
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: t("common.error"),
        description: t("organizations.updateError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <OrganizationLoadingState />;
  }

  if (!organization) {
    return <OrganizationNotFound />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <OrganizationHeader organization={organization} />

      <div className="grid gap-6 md:grid-cols-2">
        <OrganizationDetailsForm
          organization={organization}
          formData={formData}
          onInputChange={handleInputChange}
          onSave={handleSave}
          isSaving={isSaving}
        />

        <InvitationManager organization={organization} />
      </div>
    </div>
  );
};

export default OrganizationEdit;
