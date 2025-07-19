import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Users, Plus } from 'lucide-react';
import { createApiClient } from '@/services/backendApi';
import { FavoritePublisherListsApi } from '@/generated-api/src/apis/FavoritePublisherListsApi';
import { AnalyticsApi } from '@/generated-api/src/apis/AnalyticsApi';
import type { DomainFavoritePublisherList, DomainFavoritePublisherListItem, DomainAnalyticsPublisherResponse } from '@/generated-api/src/models';
import RealPublisherCard from '@/pages/marketplace/components/RealPublisherCard';
import RealPublisherDetailPanel from '@/pages/marketplace/components/RealPublisherDetailPanel';
import PublisherStatusProgress from './components/PublisherStatusProgress';
import { useToast } from '@/hooks/use-toast';

const FavoritePublisherListDetail: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedPublisher, setSelectedPublisher] = useState<DomainAnalyticsPublisherResponse | null>(null);
  const [publishers, setPublishers] = useState<DomainAnalyticsPublisherResponse[]>([]);
  const [loadingPublishers, setLoadingPublishers] = useState(false);

  // Query for favorite list details
  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ['favorite-publisher-list', listId],
    queryFn: async () => {
      if (!listId) return null;
      
      const apiClient = await createApiClient(FavoritePublisherListsApi);
      const response = await apiClient.favoritePublisherListsListIdGet({
        listId: parseInt(listId)
      });
      
      return response.data as DomainFavoritePublisherList;
    },
    enabled: !!listId,
  });

  // Query for list items with publisher details
  const { data: listItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['favorite-publisher-list-items', listId],
    queryFn: async () => {
      if (!listId) return [];
      
      const apiClient = await createApiClient(FavoritePublisherListsApi);
      const response = await apiClient.favoritePublisherListsListIdPublishersGet({
        listId: parseInt(listId),
        includeDetails: true
      });
      
      return response.data as DomainFavoritePublisherListItem[];
    },
    enabled: !!listId,
  });

  // Fetch detailed publisher information for items that don't have publisher details
  React.useEffect(() => {
    const fetchPublisherDetails = async () => {
      if (!listItems || listItems.length === 0) {
        setPublishers([]);
        return;
      }

      setLoadingPublishers(true);
      const apiClient = await createApiClient(AnalyticsApi);
      const publisherResponses: DomainAnalyticsPublisherResponse[] = [];

      for (const item of listItems) {
        try {
          let publisherResponse: DomainAnalyticsPublisherResponse;
          
          if (item.publisher) {
            // If publisher details are already included, convert them to the expected type
            publisherResponse = {
              publisher: item.publisher as any // Type conversion needed due to API type differences
            };
          } else if (item.publisherDomain) {
            // Fetch publisher details by domain
            const response = await apiClient.apiV1AnalyticsAffiliatesDomainDomainGet({
              domain: item.publisherDomain
            });
            publisherResponse = response.data;
          } else {
            continue; // Skip items without domain or publisher data
          }

          publisherResponses.push(publisherResponse);
        } catch (error) {
          console.error(`Failed to fetch publisher details for ${item.publisherDomain}:`, error);
        }
      }

      setPublishers(publisherResponses);
      setLoadingPublishers(false);
    };

    fetchPublisherDetails();
  }, [listItems]);

  // Remove publisher from list mutation
  const removePublisherMutation = useMutation({
    mutationFn: async (domain: string) => {
      if (!listId) throw new Error('No list ID');
      
      const apiClient = await createApiClient(FavoritePublisherListsApi);
      return await apiClient.favoritePublisherListsListIdPublishersDomainDelete({
        listId: parseInt(listId),
        domain
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-publisher-list-items', listId] });
      toast({
        title: t('favoritePublishers.removeSuccess'),
        description: t('favoritePublishers.removeSuccessDescription'),
      });
    },
    onError: (error) => {
      console.error('Error removing publisher:', error);
      toast({
        title: t('common.error'),
        description: t('favoritePublishers.removeError'),
        variant: 'destructive',
      });
    },
  });

  const handleRemovePublisher = (domain: string) => {
    removePublisherMutation.mutate(domain);
  };

  const isLoading = listLoading || itemsLoading || loadingPublishers;

  if (!listId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-semibold mb-2">{t('common.error')}</h3>
            <p className="text-muted-foreground">{t('favoritePublishers.invalidListId')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/favorite_publisher')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {listData?.name || t('favoritePublishers.listDetail')}
          </h1>
          {listData?.description && (
            <p className="text-muted-foreground">{listData.description}</p>
          )}
        </div>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          {t('favoritePublishers.addPublisher')}
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('favoritePublishers.totalPublishers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('favoritePublishers.createdDate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">
              {listData?.createdAt ? new Date(listData.createdAt).toLocaleDateString() : '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('favoritePublishers.lastUpdated')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">
              {listData?.updatedAt ? new Date(listData.updatedAt).toLocaleDateString() : '-'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Publishers List */}
      {publishers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-4 text-6xl">👥</div>
              <h3 className="mb-2 text-lg font-semibold">{t('favoritePublishers.noPublishersInList')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('favoritePublishers.noPublishersInListDescription')}
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                {t('favoritePublishers.addFirstPublisher')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t('favoritePublishers.showingPublishers', { count: publishers.length })}
            </p>
          </div>
          
          <div className="grid gap-6 grid-cols-1">
            {publishers.map((publisherResponse, index) => {
              // Find the corresponding list item for this publisher
              const item = listItems?.find(item => 
                item.publisherDomain === publisherResponse.publisher?.domain
              );
              
              console.log(`Publisher ${publisherResponse.publisher?.domain} has status:`, item?.status);
              
              return (
                <div key={`${publisherResponse.publisher?.domain}-${index}`} className="relative">
                  <RealPublisherCard
                    publisher={publisherResponse}
                    viewMode="list"
                    onViewDetails={() => setSelectedPublisher(publisherResponse)}
                  />
                  
                  {/* Status Progress Indicator */}
                  {item?.status ? (
                    <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 border shadow-sm z-10">
                      <PublisherStatusProgress status={item.status} />
                    </div>
                  ) : (
                    <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-2 border shadow-sm z-10">
                      <span className="text-xs text-muted-foreground">No status</span>
                    </div>
                  )}
                  
                  {/* Custom remove button overlay */}
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (publisherResponse.publisher?.domain) {
                          handleRemovePublisher(publisherResponse.publisher.domain);
                        }
                      }}
                      disabled={removePublisherMutation.isPending}
                    >
                      {removePublisherMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        t('common.remove')
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Publisher Detail Panel */}
      {selectedPublisher && (
        <RealPublisherDetailPanel
          publisher={selectedPublisher}
          isOpen={!!selectedPublisher}
          onClose={() => setSelectedPublisher(null)}
        />
      )}
    </div>
  );
};

export default FavoritePublisherListDetail;