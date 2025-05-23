
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { fetchAdvertiser, deleteAdvertiser } from '@/services/advertiserService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Edit, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const AdvertiserDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { advertiserId } = useParams<{ advertiserId: string }>();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: advertiser, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['advertiser', advertiserId],
    queryFn: () => fetchAdvertiser(Number(advertiserId)),
    enabled: !!advertiserId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdvertiser(id),
    onSuccess: () => {
      toast.success(t('advertisers.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      navigate('/advertisers');
    },
    onError: (error: Error) => {
      toast.error(t('advertisers.deleteError'), {
        description: error.message,
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  const handleEdit = () => {
    navigate(`/advertisers/edit/${advertiserId}`);
  };

  const handleDelete = () => {
    if (!advertiserId) return;
    
    setIsDeleting(true);
    deleteMutation.mutate(Number(advertiserId));
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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

  if (!advertiser) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive font-medium">
          {t('advertisers.notFound')}
        </p>
        <Button variant="outline" onClick={() => navigate('/advertisers')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('advertisers.backToList')}
        </Button>
      </div>
    );
  }

  // Format the billing details for display if available
  let formattedBillingDetails = null;
  if (advertiser.billingDetails) {
    try {
      const billingObj = JSON.parse(advertiser.billingDetails);
      formattedBillingDetails = (
        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(billingObj, null, 2)}
        </pre>
      );
    } catch (e) {
      formattedBillingDetails = (
        <p className="text-destructive">Invalid JSON format</p>
      );
    }
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/advertisers')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{advertiser.name}</CardTitle>
            <CardDescription>
              {t('advertisers.advertiserDetails')}
            </CardDescription>
          </div>
          <Badge variant="outline" className={getStatusColor(advertiser.status)}>
            {advertiser.status}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {t('advertisers.basicInfo')}
            </h3>
            <div className="bg-muted/50 rounded-md p-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">{t('advertisers.idLabel')}</p>
                <p className="text-sm text-muted-foreground">{advertiser.advertiserId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('advertisers.orgIdLabel')}</p>
                <p className="text-sm text-muted-foreground">{advertiser.organizationId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('advertisers.createdLabel')}</p>
                <p className="text-sm text-muted-foreground">
                  {advertiser.createdAt 
                    ? format(new Date(advertiser.createdAt), 'PPpp') 
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('advertisers.updatedLabel')}</p>
                <p className="text-sm text-muted-foreground">
                  {advertiser.updatedAt 
                    ? format(new Date(advertiser.updatedAt), 'PPpp') 
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {t('advertisers.contactInfo')}
            </h3>
            <div className="bg-muted/50 rounded-md p-4">
              <div>
                <p className="text-sm font-medium">{t('advertisers.emailLabel')}</p>
                <p className="text-sm">{advertiser.contactEmail || '-'}</p>
              </div>
            </div>
          </div>

          {formattedBillingDetails && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('advertisers.billingDetailsLabel')}
              </h3>
              <div className="bg-muted/50 rounded-md p-4">
                {formattedBillingDetails}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {t('common.edit')}
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {t('common.delete')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('advertisers.deleteConfirmTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('advertisers.deleteConfirmMessage')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t('common.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdvertiserDetail;
