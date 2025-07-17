import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Plus, Users, Trash2, Calendar, Eye } from 'lucide-react';
import { createApiClient } from '@/services/backendApi';
import { FavoritePublisherListsApi } from '@/generated-api/src/apis/FavoritePublisherListsApi';
import type { DomainFavoritePublisherList } from '@/generated-api/src/models';
import { useToast } from '@/hooks/use-toast';

const FavoritePublisherLists: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingListId, setDeletingListId] = useState<number | null>(null);

  // Query for favorite publisher lists
  const { data: listsData, isLoading, error } = useQuery({
    queryKey: ['favorite-publisher-lists'],
    queryFn: async () => {
      const apiClient = await createApiClient(FavoritePublisherListsApi);
      const response = await apiClient.favoritePublisherListsGet();
      return response.data as DomainFavoritePublisherList[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (listId: number) => {
      const apiClient = await createApiClient(FavoritePublisherListsApi);
      return await apiClient.favoritePublisherListsListIdDelete({ listId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-publisher-lists'] });
      toast({
        title: t('favoritePublishers.deleteSuccess'),
        description: t('favoritePublishers.deleteSuccessDescription'),
      });
      setDeletingListId(null);
    },
    onError: (error) => {
      console.error('Error deleting favorite list:', error);
      toast({
        title: t('common.error'),
        description: t('favoritePublishers.deleteError'),
        variant: 'destructive',
      });
      setDeletingListId(null);
    },
  });

  const handleDelete = (listId: number) => {
    setDeletingListId(listId);
    deleteMutation.mutate(listId);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <div className="text-destructive mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('common.error')}</h3>
            <p className="text-muted-foreground">{t('favoritePublishers.loadError')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('favoritePublishers.title')}</h1>
          <p className="text-muted-foreground">{t('favoritePublishers.description')}</p>
        </div>
        <Button onClick={() => navigate('/favorite_publisher/create')}>
          <Plus className="h-4 w-4 mr-2" />
          {t('favoritePublishers.createNew')}
        </Button>
      </div>

      {/* Lists Grid */}
      {!listsData || listsData.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-4 text-6xl">📋</div>
              <h3 className="mb-2 text-lg font-semibold">{t('favoritePublishers.noLists')}</h3>
              <p className="text-muted-foreground mb-4">{t('favoritePublishers.noListsDescription')}</p>
              <Button onClick={() => navigate('/favorite_publisher/create')}>
                <Plus className="h-4 w-4 mr-2" />
                {t('favoritePublishers.createFirst')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listsData.map((list) => (
            <Card key={list.listId} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{list.name}</CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        disabled={deletingListId === list.listId}
                      >
                        {deletingListId === list.listId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('favoritePublishers.confirmDelete')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('favoritePublishers.confirmDeleteDescription', { name: list.name })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(list.listId!)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t('common.delete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                {list.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{list.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {list.items?.length || 0} {t('favoritePublishers.publishers')}
                  </span>
                </div>
                
                {list.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t('favoritePublishers.created')} {formatDate(list.createdAt)}
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/favorite_publishers/${(list as any).list_id || list.listId}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('favoritePublishers.viewPublishers')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePublisherLists;