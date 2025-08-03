import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Share2, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { InvitationService } from '@/services/invitationApi';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { ShareInvitationDialog } from './components/ShareInvitationDialog';
import { DomainAdvertiserAssociationInvitationWithDetails } from '@/generated-api/src/models';

export default function InvitationList() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<DomainAdvertiserAssociationInvitationWithDetails | null>(null);

  const { data: invitations, isLoading } = useQuery({
    queryKey: ['invitations', profile?.organization?.id, statusFilter],
    queryFn: () => InvitationService.getInvitations({
      advertiserOrgId: profile?.organization?.id,
      status: statusFilter === 'all' ? undefined : statusFilter as any,
      limit: 100
    }),
    enabled: !!profile?.organization?.id
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => InvitationService.deleteInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      toast({
        title: "Success",
        description: "Invitation deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invitation",
        variant: "destructive"
      });
    }
  });

  const filteredInvitations = invitations?.filter(invitation =>
    invitation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invitation.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status?: string, expiresAt?: string) => {
    if (status === 'disabled') {
      return <Badge variant="destructive">Disabled</Badge>;
    }
    
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    
    return <Badge variant="default">Active</Badge>;
  };

  const getUsageProgress = (current?: number, max?: number) => {
    if (!max) return { percentage: 0, label: `${current || 0}/∞ uses` };
    const percentage = ((current || 0) / max) * 100;
    return { percentage, label: `${current || 0}/${max} uses` };
  };

  const handleShare = (invitation: DomainAdvertiserAssociationInvitationWithDetails) => {
    setSelectedInvitation(invitation);
    setShareDialogOpen(true);
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this invitation?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invitation Management</h1>
          <p className="text-muted-foreground">Create and manage affiliate invitation links</p>
        </div>
        <Button onClick={() => navigate('/invitations/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Invitation
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search invitations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invitations List */}
      <div className="grid gap-4">
        {filteredInvitations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No invitations found</p>
              <Button onClick={() => navigate('/invitations/new')} variant="outline">
                Create your first invitation
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredInvitations.map((invitation) => {
            const usage = getUsageProgress(invitation.currentUses, invitation.maxUses);
            
            return (
              <Card key={invitation.invitationId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{invitation.name}</CardTitle>
                      {invitation.description && (
                        <p className="text-sm text-muted-foreground">{invitation.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(invitation.status, invitation.expiresAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Usage Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>{usage.label}</span>
                    </div>
                    <Progress value={usage.percentage} className="h-2" />
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p>{invitation.createdAt ? new Date(invitation.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    {invitation.expiresAt && (
                      <div>
                        <span className="text-muted-foreground">Expires:</span>
                        <p>{new Date(invitation.expiresAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/invitations/${invitation.invitationId}`)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/invitations/${invitation.invitationId}/edit`)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(invitation)}
                      className="gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(invitation.invitationId)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Share Dialog */}
      {selectedInvitation && (
        <ShareInvitationDialog
          invitation={selectedInvitation}
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
        />
      )}
    </div>
  );
}