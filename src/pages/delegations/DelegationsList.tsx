import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, AlertCircle } from "lucide-react";
import { createApiClient } from "@/services/backendApi";
import { DomainAgencyDelegation } from "@/generated-api/src/models";
import { AgencyDelegationsApi } from "@/generated-api/src/apis";

const DelegationsList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { organization } = useAuth();
  const { toast } = useToast();
  
  const [delegations, setDelegations] = useState<DomainAgencyDelegation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDelegations();
  }, [organization]);

  const fetchDelegations = async () => {
    if (!organization?.organizationId) return;
    
    try {
      setLoading(true);
      const delegationsApi = await createApiClient(AgencyDelegationsApi);
      
      const response = await delegationsApi.agencyDelegationsAgencyAgencyOrgIdGet({
        agencyOrgId: organization.organizationId
      });
      
      setDelegations(response);
    } catch (error) {
      console.error('Error fetching delegations:', error);
      toast({
        title: t('delegations.error'),
        description: t('delegations.fetchError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusMap = {
      'active': { variant: 'default' as const, label: t('delegations.active') },
      'pending': { variant: 'secondary' as const, label: t('delegations.pending') },
      'expired': { variant: 'destructive' as const, label: t('delegations.expired') },
      'suspended': { variant: 'outline' as const, label: t('delegations.suspended') },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      variant: 'outline' as const, 
      label: status || 'Unknown' 
    };
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const formatExpirationDate = (expiresAt?: string) => {
    if (!expiresAt) return t('delegations.neverExpires');
    return new Date(expiresAt).toLocaleDateString();
  };

  const handleViewDelegation = (delegatedOrgId?: number) => {
    if (delegatedOrgId) {
      navigate(`/delegations/${delegatedOrgId}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-lg">{t('delegations.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('delegations.title')}</h1>
          <p className="text-muted-foreground">{t('delegations.description')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('delegations.title')}
          </CardTitle>
          <CardDescription>
            {t('delegations.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {delegations.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('delegations.noDelegations')}</h3>
              <p className="text-muted-foreground">{t('delegations.noDelegationsDescription')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('delegations.organizationName')}</TableHead>
                  <TableHead>{t('delegations.status')}</TableHead>
                  <TableHead>{t('delegations.permissions')}</TableHead>
                  <TableHead>{t('delegations.expiresAt')}</TableHead>
                  <TableHead>{t('delegations.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delegations.map((delegation) => (
                  <TableRow key={delegation.delegationId}>
                    <TableCell className="font-medium">
                      {/* For now, we'll show the advertiser org ID, this could be enhanced to show actual org name */}
                      Organization {delegation.advertiserOrgId}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(delegation.status?.toString())}
                    </TableCell>
                    <TableCell>
                      {delegation.permissions ? (
                        <div className="text-sm text-muted-foreground">
                          {JSON.parse(delegation.permissions).length} permissions
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No permissions</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatExpirationDate(delegation.expiresAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDelegation(delegation.advertiserOrgId)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {t('delegations.viewDashboard')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DelegationsList;