import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth';
import { fetchAffiliates } from '@/services/affiliateService';
import { DomainAffiliate } from '@/generated-api/src/models';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, PlusCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const AffiliateList: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { organization, profile, isOrganizationLoading, fetchOrganization } = useAuth();

  console.log("Auth organization:", organization);
  console.log("Auth profile:", profile);
  
  // Get the organization ID from the auth context
  const organizationId = organization?.organizationId || 
                         profile?.organization?.id;

  console.log("Using organization ID for affiliates fetch:", organizationId);

  // Try to fetch organization if not available
  useEffect(() => {
    const loadOrgIfNeeded = async () => {
      if (!organization && profile?.organization?.id && fetchOrganization) {
        console.log("Organization not loaded but ID available, fetching...");
        try {
          await fetchOrganization(profile.organization.id);
        } catch (error) {
          console.error("Failed to fetch organization:", error);
        }
      }
    };
    
    loadOrgIfNeeded();
  }, [organization, profile, fetchOrganization]);

  // Use React Query to fetch affiliates
  const { data: affiliates = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['affiliates', organizationId],
    queryFn: async () => {
      if (!organizationId) {
        throw new Error('No organization ID available');
      }
      return fetchAffiliates(organizationId);
    },
    enabled: !!organizationId, // Only fetch if organizationId is available
  });

  const handleViewAffiliate = (affiliateId: number) => {
    navigate(`/affiliates/${affiliateId}`);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isOrganizationLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading affiliates...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive font-medium">
          {error instanceof Error ? error.message : t('common.errorOccurred')}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('common.tryAgain')}
        </Button>
      </div>
    );
  }

  if (!organizationId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive font-medium">
          {t('organizations.noOrganization')}
        </p>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('affiliates.title')}</h1>
          <p className="text-muted-foreground">{t('affiliates.description')}</p>
        </div>
      </div>

      {affiliates.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/50">
          <CardHeader className="text-center">
            <CardTitle>{t('affiliates.noAffiliates')}</CardTitle>
            <CardDescription>
              {t('affiliates.createYourFirst')}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('affiliates.list')}</CardTitle>
            <CardDescription>
              {t('affiliates.total', { count: affiliates.length })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>{t('affiliates.tableCaption')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('affiliates.nameColumn')}</TableHead>
                  <TableHead>{t('affiliates.contactColumn')}</TableHead>
                  <TableHead>{t('affiliates.statusColumn')}</TableHead>
                  <TableHead>{t('affiliates.createdAtColumn')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map((affiliate) => (
                  <TableRow key={affiliate.affiliateId} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{affiliate.name || 'Unknown'}</TableCell>
                    <TableCell>{affiliate.contactEmail || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(affiliate.status)}>
                        {affiliate.status || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {affiliate.createdAt 
                        ? format(new Date(affiliate.createdAt), 'MMM d, yyyy') 
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAffiliate(affiliate.affiliateId as number)}
                      >
                        {t('common.view')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AffiliateList;