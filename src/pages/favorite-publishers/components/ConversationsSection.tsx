import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Calendar, User, Eye, ChevronRight } from 'lucide-react';
import { createApiClient } from '@/services/backendApi';
import { PublisherMessagingApi } from '@/generated-api/src/apis/PublisherMessagingApi';
import type { DomainPublisherConversation } from '@/generated-api/src/models';

interface ConversationsSectionProps {
  listId?: number;
}

const ConversationsSection: React.FC<ConversationsSectionProps> = ({ listId }) => {
  const { t } = useTranslation();
  const [selectedConversation, setSelectedConversation] = useState<DomainPublisherConversation | null>(null);

  // Query for conversations
  const { data: conversationsData, isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const apiClient = await createApiClient(PublisherMessagingApi);
      const response = await apiClient.apiV1PublisherMessagingConversationsGet({
        page: 1,
        pageSize: 20
      });
      return response;
    },
  });

  const conversations = conversationsData?.conversations || [];

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-50 text-green-700 border-green-200';
      case 'closed': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t('conversations.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t('conversations.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">{t('conversations.loadError')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t('conversations.title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('conversations.description')}
        </p>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4 text-4xl">💬</div>
            <h3 className="mb-2 text-lg font-semibold">{t('conversations.noConversations')}</h3>
            <p className="text-muted-foreground text-sm">
              {t('conversations.noConversationsDescription')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{conversation.subject}</h4>
                      {conversation.status && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(conversation.status)}`}
                        >
                          {conversation.status}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{conversation.publisherDomain}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{conversation.messageCount || 0} {t('conversations.messages')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(conversation.lastMessageAt || conversation.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {conversationsData?.total && conversationsData.total > conversations.length && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  {t('conversations.loadMore')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationsSection;