import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Copy, Share2, QrCode, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvitationService } from '@/services/invitationApi';
import { useToast } from '@/hooks/use-toast';
import { DomainAdvertiserAssociationInvitationWithDetails } from '@/generated-api/src/models';

interface ShareInvitationDialogProps {
  invitation: DomainAdvertiserAssociationInvitationWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareInvitationDialog({ invitation, open, onOpenChange }: ShareInvitationDialogProps) {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');

  const { data: linkData, refetch: generateLink } = useQuery({
    queryKey: ['invitation-link', invitation.invitationId],
    queryFn: () => InvitationService.generateInvitationLink(
      invitation.invitationId!,
      window.location.origin
    ),
    enabled: false,
  });

  const generateLinkMutation = useMutation({
    mutationFn: () => InvitationService.generateInvitationLink(
      invitation.invitationId!,
      window.location.origin
    ),
    onSuccess: (data) => {
      const url = data.invitation_link || '';
      setCurrentUrl(url);
      toast({
        title: "Success",
        description: "Invitation link generated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate invitation link",
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Link copied to clipboard"
      });
    });
  };

  const handleGenerateLink = () => {
    generateLinkMutation.mutate();
  };

  const invitationUrl = linkData?.invitation_link || currentUrl;

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Partnership Invitation: ${invitation.name}`);
    const body = encodeURIComponent(
      `Hi there!\n\nYou've been invited to join our affiliate partnership program.\n\n` +
      `${invitation.description || ''}\n\n` +
      `Click the link below to view the invitation and get started:\n${invitationUrl}\n\n` +
      `Best regards`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 Partnership Invitation: ${invitation.name}\n\n` +
      `${invitation.description || ''}\n\n` +
      `Join our affiliate program: ${invitationUrl}`
    );
    window.open(`https://wa.me/?text=${text}`);
  };

  const shareViaLinkedIn = () => {
    const url = encodeURIComponent(invitationUrl);
    const text = encodeURIComponent(`Partnership opportunity: ${invitation.name}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}`);
  };

  const generateQRCode = () => {
    // Simple QR code generation using QR Server API
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(invitationUrl)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Invitation: {invitation.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="link" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invitation Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!invitationUrl ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      Generate a shareable link for this invitation
                    </p>
                    <Button 
                      onClick={handleGenerateLink}
                      disabled={generateLinkMutation.isPending}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {generateLinkMutation.isPending ? 'Generating...' : 'Generate Link'}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Input
                        value={invitationUrl}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(invitationUrl)}
                        className="gap-2 shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={shareViaEmail}
                        className="gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Share via Email
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(invitationUrl)}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Media Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                {invitationUrl ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={shareViaWhatsApp}
                      className="gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      onClick={shareViaLinkedIn}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      LinkedIn
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Generate a link first to enable social media sharing
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                {invitationUrl ? (
                  <div className="text-center space-y-4">
                    <div className="inline-block p-4 bg-white rounded-lg border">
                      <img
                        src={generateQRCode()}
                        alt="QR Code for invitation"
                        className="w-48 h-48"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code to access the invitation
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = generateQRCode();
                        link.download = `invitation-qr-${invitation.invitationId}.png`;
                        link.click();
                      }}
                      className="gap-2"
                    >
                      <QrCode className="h-4 w-4" />
                      Download QR Code
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Generate a link first to create a QR code
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}