import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Building2, Calendar, Users, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PublicInvitationService, InvitationService } from '@/services/invitationApi';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

export default function PublicInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');

  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ['public-invitation', token],
    queryFn: () => PublicInvitationService.getPublicInvitation(token!),
    enabled: !!token,
    retry: false,
  });

  const useInvitationMutation = useMutation({
    mutationFn: ({ affiliateOrgId }: { affiliateOrgId: number }) => 
      InvitationService.useInvitation({
        invitationToken: token!,
        affiliateOrgId,
      }),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success!",
          description: "Association request created successfully. You can now access the advertiser's campaigns.",
        });
        navigate('/associations');
      } else {
        toast({
          title: "Notice",
          description: response.errorMessage || "Association already exists or invitation could not be used.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to use invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAcceptInvitation = () => {
    if (!selectedOrgId) {
      toast({
        title: "Error",
        description: "Please select an affiliate organization",
        variant: "destructive",
      });
      return;
    }

    useInvitationMutation.mutate({ affiliateOrgId: Number(selectedOrgId) });
  };

  const isExpired = invitation?.expiresAt && new Date(invitation.expiresAt) < new Date();
  const isDisabled = invitation?.status === 'disabled';
  const isUsageLimitReached = invitation?.maxUses && (invitation.currentUses || 0) >= invitation.maxUses;
  const canAccept = !isExpired && !isDisabled && !isUsageLimitReached && user;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invitation Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This invitation link is invalid or has been removed.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-2">Partnership Invitation</h1>
          <p className="text-muted-foreground">
            You've been invited to join an affiliate partnership
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
            {/* Invitation Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{invitation.name}</CardTitle>
                    {invitation.advertiserOrganization?.name && (
                      <p className="text-muted-foreground flex items-center gap-2 mt-2">
                        <Building2 className="h-4 w-4" />
                        {invitation.advertiserOrganization.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {isExpired && <Badge variant="destructive">Expired</Badge>}
                    {isDisabled && <Badge variant="destructive">Disabled</Badge>}
                    {isUsageLimitReached && <Badge variant="secondary">Usage Limit Reached</Badge>}
                    {canAccept && <Badge variant="default">Active</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {invitation.description && (
                  <div>
                    <h3 className="font-medium mb-2">About This Partnership</h3>
                    <p className="text-muted-foreground">{invitation.description}</p>
                  </div>
                )}

                {invitation.message && (
                  <div>
                    <h3 className="font-medium mb-2">Welcome Message</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">{invitation.message}</p>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>

            {/* Authentication Required */}
            {!user && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to log in to accept this invitation.{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>
                    Sign in here
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Accept Invitation Section */}
            {user && canAccept && (
              <Card>
                <CardHeader>
                  <CardTitle>Accept Invitation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.organization ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Select the affiliate organization you want to use for this partnership:
                      </p>
                      <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your affiliate organization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={String(profile.organization.id)}>
                            {profile.organization.name}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={handleAcceptInvitation}
                        disabled={useInvitationMutation.isPending || !selectedOrgId}
                        className="w-full"
                      >
                        {useInvitationMutation.isPending ? 'Processing...' : 'Accept Invitation'}
                      </Button>
                    </>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You need to be part of an affiliate organization to accept this invitation.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Error States */}
            {user && !canAccept && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {isExpired && "This invitation has expired."}
                  {isDisabled && "This invitation has been disabled."}
                  {isUsageLimitReached && "This invitation has reached its usage limit."}
                </AlertDescription>
              </Alert>
            )}
          </div>

        </div>
    </div>
  );
}