import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth';
import { fetchAdvertisers } from '@/services/advertiserService';
import { DomainAdvertiser } from '@/generated-api/src/models';
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

const AdvertiserList: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { organization, profile, isOrganizationLoading, fetchOrganization } = useAuth();

  console.log("Auth organization:", organization);
  console.log("Auth profile:", profile);
  
  // Get the organization ID from the auth context
  const organizationId = organization?.organizationId || 
                         profile?.organization?.id;

  console.log("Using organization ID for advertisers fetch:", organizationId);

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

  // Use React Query to fetch advertisers
  const { data: advertisers = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['advertisers', organizationId],
    queryFn: async () => {
      if (!organizationId) {
        throw new Error('No organization ID available');
      }
      return fetchAdvertisers(organizationId);
    },
    enabled: !!organizationId, // Only fetch if organizationId is available
  });

  const handleCreateAdvertiser = () => {
    navigate('/advertisers/create');
  };

  const handleViewAdvertiser = (advertiserId: number) => {
    navigate(`/advertisers/${advertiserId}`);
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
        <span className="ml-2">Loading advertisers...</span>
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
          {t('organization.noOrganization')}
        </p>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('advertisers.title')}</h1>
          <p className="text-muted-foreground">{t('advertisers.description')}</p>
        </div>
        <Button onClick={handleCreateAdvertiser}>
          <Plus className="mr-2 h-4 w-4" />
          {t('advertisers.createNew')}
        </Button>
      </div>

      {advertisers.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/50">
          <CardHeader className="text-center">
            <CardTitle>{t('advertisers.noAdvertisers')}</CardTitle>
            <CardDescription>
              {t('advertisers.createYourFirst')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleCreateAdvertiser}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('advertisers.createAdvertiser')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('advertisers.list')}</CardTitle>
            <CardDescription>
              {t('advertisers.total', { count: advertisers.length })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>{t('advertisers.tableCaption')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('advertisers.nameColumn')}</TableHead>
                  <TableHead>{t('advertisers.contactColumn')}</TableHead>
                  <TableHead>{t('advertisers.statusColumn')}</TableHead>
                  <TableHead>{t('advertisers.createdAtColumn')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisers.map((advertiser) => (
                  <TableRow key={advertiser.advertiserId} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{advertiser.name}</TableCell>
                    <TableCell>{advertiser.contactEmail || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(advertiser.status)}>
                        {advertiser.status || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {advertiser.createdAt 
                        ? format(new Date(advertiser.createdAt), 'MMM d, yyyy') 
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAdvertiser(advertiser.advertiserId as number)}
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

export default AdvertiserList;
