
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
import { supabase } from "@/integrations/supabase/client";

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
      const inviteUrl = `${window.location.origin}/signup?invitation=true&org=${profile.organization.id}&email=${encodeURIComponent(email)}`;
      
      // Use Supabase's invitation system
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: inviteUrl,
        data: {
          organization_id: profile.organization.id,
          organization_name: profile.organization.name,
          invited_by: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim()
        }
      });

      if (error) {
        throw error;
      }

      setInvitationLink(inviteUrl);
      setEmail("");
      
      toast({
        title: "Invitation sent!",
        description: `Invitation email has been sent to ${email}`,
      });
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error sending invitation",
        description: error.message || "Failed to send invitation",
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

      {/* Send Invitation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Invitation
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
                Sending Invitation...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Invitation
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
              The invitation email has been sent, but you can also share this link directly:
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvitationManagement;
