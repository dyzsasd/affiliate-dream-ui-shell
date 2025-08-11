import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchAffiliate } from '@/services/affiliateService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const AffiliateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: affiliate, isLoading, isError, error } = useQuery({
    queryKey: ['affiliate', id],
    queryFn: async () => {
      if (!id) throw new Error('No affiliate ID provided');
      return fetchAffiliate(parseInt(id));
    },
    enabled: !!id,
  });

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
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading affiliate...</span>
      </div>
    );
  }

  if (isError || !affiliate) {
    return (
      <div className="container py-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/affiliates')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('affiliates.backToList')}
        </Button>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive font-medium">
            {error instanceof Error ? error.message : t('affiliates.notFound')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/affiliates')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('affiliates.backToList')}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{affiliate.name || 'Unknown'}</CardTitle>
              <CardDescription>
                Affiliate ID: {affiliate.affiliateId}
              </CardDescription>
            </div>
            <Badge variant="outline" className={getStatusColor(affiliate.status)}>
              {affiliate.status || 'unknown'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-muted-foreground">
                <span className="font-medium">Email:</span> {affiliate.contactEmail || '-'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dates</h3>
              <p className="text-muted-foreground">
                <span className="font-medium">Created:</span>{' '}
                {affiliate.createdAt 
                  ? format(new Date(affiliate.createdAt), 'MMM d, yyyy HH:mm') 
                  : '-'}
              </p>
              {affiliate.updatedAt && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Updated:</span>{' '}
                  {format(new Date(affiliate.updatedAt), 'MMM d, yyyy HH:mm')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateDetail;