import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Star, Plus } from 'lucide-react';
import { createApiClient } from '@/services/backendApi';
import { FavoritePublisherListsApi } from '@/generated-api/src/apis/FavoritePublisherListsApi';
import type { DomainFavoritePublisherList, DomainAnalyticsPublisherResponse } from '@/generated-api/src/models';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AddToFavoritesModalProps {
  publisher: DomainAnalyticsPublisherResponse;
  isOpen: boolean;
  onClose: () => void;
}

const AddToFavoritesModal: React.FC<AddToFavoritesModalProps> = ({
  publisher,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [notes, setNotes] = useState('');

  const publisherDomain = publisher.publisher?.domain || '';

  // Query for favorite publisher lists
  const { data: listsData, isLoading: isLoadingLists } = useQuery({
    queryKey: ['favorite-publisher-lists'],
    queryFn: async () => {
      const apiClient = await createApiClient(FavoritePublisherListsApi);
      const response = await apiClient.favoritePublisherListsGet();
      return response.data as DomainFavoritePublisherList[];
    },
    enabled: isOpen,
  });

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async ({ listId, notes }: { listId: number; notes: string }) => {
      const apiClient = await createApiClient(FavoritePublisherListsApi);
      return await apiClient.favoritePublisherListsListIdPublishersPost({
        listId,
        request: {
          publisherDomain,
          notes: notes || undefined,
          status: 'added',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-publisher-lists'] });
      toast({
        title: "Success",
        description: `${publisherDomain} has been added to your favorite list!`,
      });
      handleClose();
    },
    onError: (error: any) => {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add publisher to favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setSelectedListId('');
    setNotes('');
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedListId) {
      toast({
        title: "Please select a list",
        description: "You need to select a favorite list to add this publisher to.",
        variant: "destructive",
      });
      return;
    }

    addToFavoritesMutation.mutate({
      listId: parseInt(selectedListId),
      notes,
    });
  };

  const handleCreateNewList = () => {
    handleClose();
    navigate('/favorite_publisher/create');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Add to Favorites
          </DialogTitle>
          <DialogDescription>
            Add <strong>{publisherDomain}</strong> to one of your favorite publisher lists.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Lists Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select a favorite list</Label>
            {isLoadingLists ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : !listsData || listsData.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-muted-foreground">
                  No favorite lists found. Create one first.
                </p>
                <Button variant="outline" onClick={handleCreateNewList}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New List
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedListId} onValueChange={setSelectedListId}>
                <div className="space-y-2">
                  {listsData.map((list) => (
                    <div key={list.listId} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={list.listId?.toString() || ''}
                        id={`list-${list.listId}`}
                      />
                      <Label
                        htmlFor={`list-${list.listId}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div>
                          <div className="font-medium">{list.name}</div>
                          {list.description && (
                            <div className="text-sm text-muted-foreground">
                              {list.description}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {list.items?.length || 0} publishers
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this publisher..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {listsData && listsData.length > 0 && (
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={handleCreateNewList}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New List
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedListId || addToFavoritesMutation.isPending}
          >
            {addToFavoritesMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Star className="h-4 w-4 mr-2" />
                Add to Favorites
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToFavoritesModal;