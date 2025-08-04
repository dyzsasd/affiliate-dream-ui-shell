import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { createApiClient } from '@/services/backendApi';
import { 
  DomainOrganizationAssociation, 
  DomainAssociationStatus 
} from '@/generated-api/src/models';
import { OrganizationAssociationsApi, OrganizationAssociationsGetAssociationTypeEnum } from '@/generated-api/src/apis';
import { Users, Check, X, Pause, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssociationsManagement: React.FC = () => {
  const { organization } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [associations, setAssociations] = useState<DomainOrganizationAssociation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (organization?.organizationId) {
      fetchAssociations();
    }
  }, [organization]);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const api = await createApiClient(OrganizationAssociationsApi);
      
      const queryParams = organization?.type === 'affiliate' 
        ? { affiliateOrgId: organization.organizationId }
        : { advertiserOrgId: organization.organizationId };

      const response = await api.organizationAssociationsGet({
        ...queryParams,
        associationType: OrganizationAssociationsGetAssociationTypeEnum.Request,
        withDetails: true,
      });

      setAssociations(response || []);
    } catch (error) {
      console.error('Error fetching associations:', error);
      toast({
        title: t("associations.error"),
        description: t("associations.failedToLoadAssociations"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (associationId: string) => {
    try {
      setActionLoading(associationId);
      const api = await createApiClient(OrganizationAssociationsApi);
      
      await api.organizationAssociationsIdApprovePost({
        id: parseInt(associationId),
      });

      toast({
        title: "Success",
        description: "Association approved successfully",
      });

      fetchAssociations();
    } catch (error) {
      console.error('Error approving association:', error);
      toast({
        title: "Error",
        description: "Failed to approve association",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (associationId: string) => {
    try {
      setActionLoading(associationId);
      const api = await createApiClient(OrganizationAssociationsApi);
      
      await api.organizationAssociationsIdRejectPost({
        id: parseInt(associationId),
      });

      toast({
        title: "Success",
        description: "Association rejected",
      });

      fetchAssociations();
    } catch (error) {
      console.error('Error rejecting association:', error);
      toast({
        title: "Error",
        description: "Failed to reject association",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (associationId: string) => {
    try {
      setActionLoading(associationId);
      const api = await createApiClient(OrganizationAssociationsApi);
      
      await api.organizationAssociationsIdSuspendPost({
        id: parseInt(associationId),
      });

      toast({
        title: "Success",
        description: "Association suspended",
      });

      fetchAssociations();
    } catch (error) {
      console.error('Error suspending association:', error);
      toast({
        title: "Error",
        description: "Failed to suspend association",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (associationId: string) => {
    try {
      setActionLoading(associationId);
      const api = await createApiClient(OrganizationAssociationsApi);
      
      await api.organizationAssociationsIdReactivatePost({
        id: parseInt(associationId),
      });

      toast({
        title: "Success",
        description: "Association reactivated",
      });

      fetchAssociations();
    } catch (error) {
      console.error('Error reactivating association:', error);
      toast({
        title: "Error",
        description: "Failed to reactivate association",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: DomainAssociationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">{t("associations.pending")}</Badge>;
      case 'active':
        return <Badge variant="outline" className="text-green-600 border-green-600">{t("associations.active")}</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">{t("associations.suspended")}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">{t("associations.rejected")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActionButtons = (association: DomainOrganizationAssociation) => {
    const isLoading = actionLoading === association.associationId?.toString();
    const isAffiliate = organization?.type === 'affiliate';
    const isRequestType = association.associationType === 'request';
    
    // Affiliates cannot approve/reject their own requests
    const canApproveReject = !(isAffiliate && isRequestType);
    
    return (
      <div className="flex space-x-2">
        {association.status === 'pending' && canApproveReject && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApprove(association.associationId?.toString() || '')}
              disabled={isLoading}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(association.associationId?.toString() || '')}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </>
        )}
        
        {association.status === 'active' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSuspend(association.associationId?.toString() || '')}
            disabled={isLoading}
            className="text-orange-600 hover:text-orange-700"
          >
            <Pause className="w-4 h-4 mr-1" />
            Suspend
          </Button>
        )}
        
        {association.status === 'suspended' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleReactivate(association.associationId?.toString() || '')}
            disabled={isLoading}
            className="text-green-600 hover:text-green-700"
          >
            <Check className="w-4 h-4 mr-1" />
            Reactivate
          </Button>
        )}
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/affiliates/${association.affiliateOrgId}/details`)}
          className="text-blue-600 hover:text-blue-700"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading affiliate associations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">Affiliate Associations</CardTitle>
            </div>
            <CardDescription>
              Manage your affiliate partnerships and association requests
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {associations.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Affiliate Associations</h3>
                <p className="text-muted-foreground">
                  You don't have any affiliate associations yet.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Updated Date</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {associations.map((association) => (
                    <TableRow key={association.associationId}>
                      <TableCell className="font-medium">
                        Organization ID: {association.affiliateOrgId || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {association.associationType || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(association.status!)}
                      </TableCell>
                      <TableCell>
                        {association.createdAt ? new Date(association.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {association.updatedAt ? new Date(association.updatedAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
          {association.allAffiliatesVisible && (
            <Badge variant="outline" className="text-xs">
              Affiliates Visible
            </Badge>
          )}
          {association.allCampaignsVisible && (
            <Badge variant="outline" className="text-xs">
              Campaigns Visible
            </Badge>
          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getActionButtons(association)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssociationsManagement;