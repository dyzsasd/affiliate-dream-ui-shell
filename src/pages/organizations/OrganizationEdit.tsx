
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Save, 
  ArrowLeft,
  Mail,
  Send,
  Copy,
  Check,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import { OrganizationsApi } from "@/generated-api/src/apis/OrganizationsApi";
import { DomainOrganization } from "@/generated-api/src/models";
import { createApiClient } from "@/services/backendApi";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/common/LanguageSelector";

const OrganizationEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [organization, setOrganization] = useState<DomainOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: ""
  });
  
  // Invitation functionality
  const [email, setEmail] = useState("");
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

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
        id: parseInt(id!)
      });
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

  const generateInvitationLink = async () => {
    if (!email || !organization?.organizationId) {
      toast({
        title: t("common.error"),
        description: t("organizations.invitationError"),
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingLink(true);

    try {
      // Create invitation URL with organization context
      const inviteUrl = `${window.location.origin}/signup?invitation=true&org=${organization.organizationId}&email=${encodeURIComponent(email)}&inviter=${encodeURIComponent(`${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim())}`;
      
      setInvitationLink(inviteUrl);
      setEmail("");
      
      toast({
        title: t("organizations.invitationGenerated"),
        description: t("organizations.shareLink", { name: organization.name }),
      });
    } catch (error: any) {
      console.error('Error generating invitation:', error);
      toast({
        title: t("common.error"),
        description: error.message || t("organizations.generateInvitationError"),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyInvitationLink = async () => {
    if (!invitationLink) return;

    try {
      await navigator.clipboard.writeText(invitationLink);
      setLinkCopied(true);
      toast({
        title: t("organizations.linkCopied"),
        description: t("organizations.linkCopiedDescription"),
      });
      
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("organizations.copyError"),
        variant: "destructive",
      });
    }
  };

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case 'active': return t("organizations.statusActive");
      case 'pending': return t("organizations.statusPending");
      case 'inactive': return t("organizations.statusInactive");
      default: return t("organizations.statusUnknown");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-affiliate-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!organization) {
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
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/organizations')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("organizations.editOrganization")}</h1>
            <p className="text-muted-foreground">
              {t("organizations.editDescription")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Badge variant="outline" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            ID: {organization.organizationId}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Organization Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {t("organizations.organizationDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("organizations.organizationName")}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("organizations.organizationName")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">{t("organizations.organizationType")}</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder={t("organizations.organizationType")}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("organizations.currentStatus")}</Label>
              <Badge variant="outline">
                {getStatusLabel(organization.status)}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label>{t("organizations.created")}</Label>
              <p className="text-sm text-muted-foreground">
                {organization.createdAt ? new Date(organization.createdAt).toLocaleDateString() : t("organizations.statusUnknown")}
              </p>
            </div>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Save className="w-4 h-4 mr-2 animate-pulse" />
                  {t("organizations.saving")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t("common.saveChanges")}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Invitation Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {t("organizations.generateInvitation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("organizations.emailAddress")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("organizations.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isGeneratingLink}
              />
            </div>
            
            <Button 
              onClick={generateInvitationLink} 
              disabled={isGeneratingLink || !email}
              className="w-full"
            >
              {isGeneratingLink ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  {t("organizations.generatingLink")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t("organizations.generateInvitationLink")}
                </>
              )}
            </Button>

            {invitationLink && (
              <div className="space-y-3 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {t("organizations.shareLink", { name: organization.name })}
                </p>
                
                <div className="flex items-center space-x-2">
                  <Input
                    value={invitationLink}
                    readOnly
                    className="flex-1 bg-gray-50 text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyInvitationLink}
                    className="flex items-center gap-2"
                  >
                    {linkCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationEdit;
