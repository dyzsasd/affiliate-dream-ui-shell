import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { createApiClient } from '@/services/backendApi';
import { PublisherMessagingApi } from '@/generated-api/src/apis/PublisherMessagingApi';
import { FavoritePublisherListsApi } from '@/generated-api/src/apis/FavoritePublisherListsApi';
import type { DomainAnalyticsPublisherResponse } from '@/generated-api/src/models';

interface ContactPublisherModalProps {
  publisher: DomainAnalyticsPublisherResponse;
  isOpen: boolean;
  onClose: () => void;
  listId?: number;
}

const ContactPublisherModal: React.FC<ContactPublisherModalProps> = ({
  publisher,
  isOpen,
  onClose,
  listId
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const routeParams = useParams();
  
  // Get listId from props or route params
  const currentListId = listId || (routeParams.listId ? parseInt(routeParams.listId) : undefined);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const publisherDomain = publisher.publisher?.domain || '';

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async ({ subject, message }: { subject: string; message: string }) => {
      try {
        const apiClient = await createApiClient(PublisherMessagingApi);
        return await apiClient.apiV1PublisherMessagingConversationsPost({
          request: {
            subject,
            initialMessage: message,
            publisherDomain,
            listId: currentListId
          }
        });
      } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
      }
    },
    onSuccess: async () => {
      // Update publisher status to "contacted" if we have a list context
      if (currentListId && publisherDomain) {
        try {
          const apiClient = await createApiClient(FavoritePublisherListsApi);
          await apiClient.apiV1FavoritePublisherListsListIdPublishersDomainStatusPatch({
            listId: currentListId,
            domain: publisherDomain,
            request: {
              status: 'contacted'
            }
          });
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['favorite-publisher-list-items', currentListId.toString()] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        } catch (error) {
          console.error('Failed to update publisher status:', error);
        }
      }

      toast({
        title: t('marketplace.contactSuccess'),
        description: t('marketplace.contactSuccessDescription', { domain: publisherDomain }),
      });
      handleClose();
    },
    onError: (error: any) => {
      console.error('Error creating conversation:', error);
      toast({
        title: t('common.error'),
        description: t('marketplace.contactError'),
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    if (!createConversationMutation.isPending) {
      setSubject('');
      setMessage('');
      onClose();
    }
  };

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: t('marketplace.fillAllFields'),
        description: t('marketplace.fillAllFieldsDescription'),
        variant: "destructive",
      });
      return;
    }

    createConversationMutation.mutate({ subject: subject.trim(), message: message.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            {t('marketplace.contactPublisher')}
          </DialogTitle>
          <DialogDescription>
            {t('marketplace.contactPublisherDescription', { domain: publisherDomain })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">{t('marketplace.subject')}</Label>
            <Input
              id="subject"
              placeholder={t('marketplace.subjectPlaceholder')}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={createConversationMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t('marketplace.message')}</Label>
            <Textarea
              id="message"
              placeholder={t('marketplace.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              disabled={createConversationMutation.isPending}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={createConversationMutation.isPending}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createConversationMutation.isPending || !subject.trim() || !message.trim()}
          >
            {createConversationMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('marketplace.sending')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('marketplace.sendMessage')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactPublisherModal;