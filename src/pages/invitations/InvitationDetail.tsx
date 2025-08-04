import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Share2, BarChart3, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InvitationService } from '@/services/invitationApi';
import { ShareInvitationDialog } from './components/ShareInvitationDialog';
import { UsageChart } from './components/UsageChart';

export default function InvitationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { data: invitation, isLoading } = useQuery({
    queryKey: ['invitation', id],
    queryFn: () => InvitationService.getInvitation(Number(id)),
    enabled: !!id,
  });

  const { data: usageHistory } = useQuery({
    queryKey: ['invitation-usage', id],
    queryFn: () => InvitationService.getUsageHistory(Number(id), 50),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Invitation not found</p>
            <Button onClick={() => navigate('/invitations')} variant="outline">
              Back to Invitations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (invitation.status === 'disabled') {
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> {t("invitations.disabled")}</Badge>;
    }
    
    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> {t("invitations.expired")}</Badge>;
    }
    
    return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> {t("invitations.active")}</Badge>;
  };

  const getUsageProgress = () => {
    const current = invitation.currentUses || 0;
    const max = invitation.maxUses;
    
    if (!max) return { percentage: 0, label: `${current}/∞ uses` };
    const percentage = (current / max) * 100;
    return { percentage, label: `${current}/${max} uses` };
  };

  const usage = getUsageProgress();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/invitations')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{invitation.name}</h1>
            <p className="text-muted-foreground">Invitation Details & Analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShareDialogOpen(true)} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={() => navigate(`/invitations/${id}/edit`)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            {getStatusBadge()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{usage.label}</div>
            <Progress value={usage.percentage} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invitation.createdAt ? new Date(invitation.createdAt).toLocaleDateString() : 'N/A'}
            </div>
            <p className="text-sm text-muted-foreground">
              {invitation.createdByUser?.email || 'Unknown'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Expires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invitation.expiresAt ? new Date(invitation.expiresAt).toLocaleDateString() : 'Never'}
            </div>
            {invitation.expiresAt && (
              <p className="text-sm text-muted-foreground">
                {new Date(invitation.expiresAt) > new Date() ? 'Active' : 'Expired'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="usage">Usage History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invitation Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {invitation.description && (
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-muted-foreground">{invitation.description}</p>
                </div>
              )}

              {invitation.message && (
                <div>
                  <h4 className="font-medium">Welcome Message</h4>
                  <p className="text-muted-foreground">{invitation.message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Default Visibility Settings</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      All Affiliates Visible: {invitation.defaultAllAffiliatesVisible ? 'Yes' : 'No'}
                    </li>
                    <li>
                      All Campaigns Visible: {invitation.defaultAllCampaignsVisible ? 'Yes' : 'No'}
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Advertiser Organization</h4>
                  <p className="text-sm text-muted-foreground">
                    {invitation.advertiserOrganization?.name || 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Usage Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UsageChart usageHistory={usageHistory} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usage History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usageHistory && usageHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Affiliate Org ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageHistory.map((usage, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {usage.usedAt ? new Date(usage.usedAt).toLocaleString() : 'N/A'}
                        </TableCell>
                        <TableCell>{usage.affiliateOrgId}</TableCell>
                        <TableCell>{usage.usedByUserId || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge variant={usage.success ? "default" : "destructive"}>
                            {usage.success ? 'Success' : 'Failed'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {usage.ipAddress || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No usage history found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <ShareInvitationDialog
        invitation={invitation}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
}