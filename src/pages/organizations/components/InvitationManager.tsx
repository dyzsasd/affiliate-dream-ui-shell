
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, Copy, Check } from "lucide-react";
import { DomainOrganization } from "@/generated-api/src/models";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

interface InvitationManagerProps {
  organization: DomainOrganization;
}

const InvitationManager: React.FC<InvitationManagerProps> = ({ organization }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [email, setEmail] = useState("");
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

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

  return (
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
  );
};

export default InvitationManager;
