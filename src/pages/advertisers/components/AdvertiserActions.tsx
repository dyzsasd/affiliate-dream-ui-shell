
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteAdvertiser } from '@/services/advertiserService';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface AdvertiserActionsProps {
  advertiserId: number;
}

export const AdvertiserActions: React.FC<AdvertiserActionsProps> = ({ advertiserId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
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
  );
};
