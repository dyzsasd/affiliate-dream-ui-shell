import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createApiClient } from '@/services/backendApi';
import { FavoritePublisherListsApi } from '@/generated-api/src/apis/FavoritePublisherListsApi';
import { useToast } from '@/hooks/use-toast';
import type { DomainCreateFavoritePublisherListRequest } from '@/generated-api/src/models';

interface CreateListFormData {
  name: string;
  description?: string;
}

const CreateFavoritePublisherList: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateListFormData>();

  const createListMutation = useMutation({
    mutationFn: async (data: CreateListFormData) => {
      const apiClient = await createApiClient(FavoritePublisherListsApi);
      const request: DomainCreateFavoritePublisherListRequest = {
        name: data.name,
        description: data.description || '',
      };
      
      return await apiClient.favoritePublisherListsPost({ request });
    },
    onSuccess: (response) => {
      toast({
        title: t('favoritePublishers.createSuccess'),
        description: t('favoritePublishers.createSuccessDescription'),
      });
      
      // Navigate to the new list detail page
      if (response.data && 'id' in response.data) {
        navigate(`/favorite_publishers/${response.data.id}`);
      } else {
        navigate('/favorite_publisher');
      }
    },
    onError: (error) => {
      console.error('Error creating favorite publisher list:', error);
      toast({
        title: t('common.error'),
        description: t('favoritePublishers.createError'),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: CreateListFormData) => {
    createListMutation.mutate(data);
  };

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
        <h1 className="text-2xl font-bold tracking-tight">
          {t('favoritePublishers.createNewList')}
        </h1>
      </div>

      {/* Create Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t('favoritePublishers.listDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('favoritePublishers.listName')}</Label>
              <Input
                id="name"
                {...register('name', { 
                  required: t('favoritePublishers.nameRequired') 
                })}
                placeholder={t('favoritePublishers.listNamePlaceholder')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('favoritePublishers.description')} ({t('common.optional')})</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder={t('favoritePublishers.descriptionPlaceholder')}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={createListMutation.isPending}
              >
                {createListMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t('favoritePublishers.creating')}
                  </>
                ) : (
                  t('favoritePublishers.createList')
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/favorite_publisher')}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFavoritePublisherList;