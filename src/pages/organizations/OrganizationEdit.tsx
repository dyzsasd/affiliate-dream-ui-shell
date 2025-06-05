
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

const OrganizationEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
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
        title: "Error",
        description: "Failed to fetch organization details",
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
        title: "Success",
        description: "Organization updated successfully",
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateInvitationLink = async () => {
    if (!email || !organization?.organizationId) {
      toast({
        title: "Error",
        description: "Please enter an email address",
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
        title: "Invitation link generated!",
        description: `Share this link with ${email} to invite them to join ${organization.name}`,
      });
    } catch (error: any) {
      console.error('Error generating invitation:', error);
      toast({
        title: "Error generating invitation",
        description: error.message || "Failed to generate invitation",
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
        title: "Link copied!",
        description: "Invitation link has been copied to clipboard",
      });
      
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-affiliate-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading organization...</p>
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
              <h3 className="text-lg font-semibold mb-2">Organization Not Found</h3>
              <p className="text-muted-foreground">
                The organization you're looking for doesn't exist.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => navigate('/organizations')}
              >
                Back to Organizations
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
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Organization</h1>
            <p className="text-muted-foreground">
              Update organization details and manage invitations
            </p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          ID: {organization.organizationId}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Organization Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Organization name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Organization Type</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="Organization type"
              />
            </div>

            <div className="space-y-2">
              <Label>Current Status</Label>
              <Badge variant="outline">
                {organization.status || 'unknown'}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label>Created</Label>
              <p className="text-sm text-muted-foreground">
                {organization.createdAt ? new Date(organization.createdAt).toLocaleDateString() : 'Unknown'}
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
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
              Generate Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
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
                  Generating Link...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Generate Invitation Link
                </>
              )}
            </Button>

            {invitationLink && (
              <div className="space-y-3 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Share this link to invite someone to {organization.name}:
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
