import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useContext } from 'react';
import { DelegationContext } from '@/contexts/delegation';
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

// Use the generated API type directly
import { DomainOrganizationAssociationWithDetails } from '@/generated-api/src/models';
import { Users, Check, X, Pause, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Delegation context type for safe access
interface DelegationContextType {
  delegatedOrgId: number | null;
  setDelegatedOrgId: (orgId: number | null) => void;
  isDelegationMode: boolean;
}

const AssociationsManagement: React.FC = () => {
  const { organization } = useAuth();
  
  // Safely use delegation context - it may not be available in all routes
  const delegationContext = useContext(DelegationContext) as DelegationContextType | undefined;
  const isDelegationMode = delegationContext?.isDelegationMode || false;
  const delegatedOrgId = delegationContext?.delegatedOrgId || null;
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [associations, setAssociations] = useState<DomainOrganizationAssociationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Use delegated org ID if in delegation mode, otherwise use auth org ID
  const effectiveOrgId = isDelegationMode ? delegatedOrgId : organization?.organizationId;

  useEffect(() => {
    if (effectiveOrgId) {
      fetchAssociations();
    }
  }, [effectiveOrgId]);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const api = await createApiClient(OrganizationAssociationsApi);
      
      // Use effective org ID (delegated or auth org) and determine organization type
      const orgType = isDelegationMode ? 'advertiser' : organization?.type;
      const queryParams = orgType === 'affiliate' 
        ? { affiliateOrgId: effectiveOrgId }
        : { advertiserOrgId: effectiveOrgId };

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
        title: t("associations.success"),
        description: t("associations.approveSuccess"),
      });

      fetchAssociations();
    } catch (error) {
      console.error('Error approving association:', error);
      toast({
        title: t("associations.error"),
        description: t("associations.approveError"),
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
        title: t("associations.success"),
        description: t("associations.rejectSuccess"),
      });

      fetchAssociations();
    } catch (error) {
      console.error('Error rejecting association:', error);
      toast({
        title: t("associations.error"),
        description: t("associations.rejectError"),
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
        title: t("associations.success"),
        description: t("associations.suspendSuccess"),
      });

      fetchAssociations();
    } catch (error) {
      console.error('Error suspending association:', error);
      toast({
        title: t("associations.error"),
        description: t("associations.suspendError"),
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
        title: t("associations.success"),
        description: t("associations.reactivateSuccess"),
      });

      fetchAssociations();
    } catch (error) {
      console.error('Error reactivating association:', error);
      toast({
        title: t("associations.error"),
        description: t("associations.reactivateError"),
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

  const getActionButtons = (association: DomainOrganizationAssociationWithDetails) => {
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
              {t("associations.approve")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(association.associationId?.toString() || '')}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              {t("associations.reject")}
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
            {t("associations.suspend")}
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
            {t("associations.reactivate")}
          </Button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("associations.loadingAssociations")}</p>
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
              <CardTitle className="text-2xl">{t("associations.affiliateAssociations")}</CardTitle>
            </div>
            <CardDescription>
              {t("associations.managePartnerships")}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {associations.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("associations.noAffiliateAssociations")}</h3>
                <p className="text-muted-foreground">
                  {t("associations.noAffiliateAssociationsMessage")}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("associations.advertiser")}</TableHead>
                    <TableHead>{t("associations.affiliate")}</TableHead>
                    <TableHead>{t("associations.status")}</TableHead>
                    <TableHead>{t("associations.createdAt")}</TableHead>
                    <TableHead>{t("associations.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {associations.map((association) => (
                    <TableRow key={association.associationId}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {association.advertiserOrganization?.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {association.advertiserOrganization?.name || t("associations.unknownAdvertiser")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">
                              {association.affiliateOrganization?.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {association.affiliateOrganization?.name || t("associations.unknownAffiliate")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(association.status!)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>
                            {association.createdAt ? new Date(association.createdAt).toLocaleDateString() : t("associations.na")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {getActionButtons(association)}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/associations/${association.associationId}/details`)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {t("associations.viewDetails")}
                          </Button>
                        </div>
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