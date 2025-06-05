
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Send, 
  Users, 
  Copy,
  Check,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";

const InvitationManagement: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const generateInvitationLink = async () => {
    if (!email || !profile?.organization?.id) {
      toast({
        title: "Error",
        description: "Please enter an email address and ensure you're part of an organization",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create invitation URL with organization context
      const inviteUrl = `${window.location.origin}/signup?invitation=true&org=${profile.organization.id}&email=${encodeURIComponent(email)}&inviter=${encodeURIComponent(`${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim())}`;
      
      setInvitationLink(inviteUrl);
      setEmail("");
      
      toast({
        title: "Invitation link generated!",
        description: `Share this link with ${email} to invite them to join ${profile.organization.name}`,
      });
    } catch (error: any) {
      console.error('Error generating invitation:', error);
      toast({
        title: "Error generating invitation",
        description: error.message || "Failed to generate invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const sendEmailInvitation = async () => {
    if (!invitationLink) return;

    // For now, we'll just copy the link. 
    // To actually send emails, you'd need to implement an edge function with a service like Resend
    await copyInvitationLink();
    
    toast({
      title: "Link ready to share",
      description: "The invitation link has been copied. You can now share it via email, messaging, or any other method.",
    });
  };

  if (!profile?.organization) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Organization</h3>
              <p className="text-muted-foreground">
                You need to be part of an organization to send invitations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Invitations</h1>
          <p className="text-muted-foreground">
            Invite new members to join {profile.organization.name}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          {profile.organization.name}
        </Badge>
      </div>

      {/* Generate Invitation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Generate Invitation Link
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
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={generateInvitationLink} 
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? (
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
        </CardContent>
      </Card>

      {/* Generated Link */}
      {invitationLink && (
        <Card>
          <CardHeader>
            <CardTitle>Invitation Link Generated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this link with the person you want to invite to your organization:
            </p>
            
            <div className="flex items-center space-x-2">
              <Input
                value={invitationLink}
                readOnly
                className="flex-1 bg-gray-50"
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
                {linkCopied ? "Copied!" : "Copy"}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={sendEmailInvitation}
                className="flex-1"
              >
                <Mail className="w-4 h-4 mr-2" />
                Copy & Share
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p><strong>Note:</strong> The invited person will need to use this link to sign up and will automatically be added to your organization.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvitationManagement;
