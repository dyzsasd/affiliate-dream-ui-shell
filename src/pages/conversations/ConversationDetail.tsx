import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { createApiClient } from '@/services/backendApi';
import { PublisherMessagingApi } from '@/generated-api/src/apis/PublisherMessagingApi';
import { DomainSendMessageRequest } from '@/generated-api/src/models/DomainSendMessageRequest';

const ConversationDetail: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { t } = useTranslation('conversations');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');

  // Fetch conversation details with messages
  const { data: conversationData, isLoading, error } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID is required');
      
      const apiClient = await createApiClient(PublisherMessagingApi);
      return await apiClient.apiV1PublisherMessagingConversationsConversationIdGet({
        conversationId: parseInt(conversationId),
      });
    },
    enabled: !!conversationId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: DomainSendMessageRequest) => {
      if (!conversationId) throw new Error('Conversation ID is required');
      
      const apiClient = await createApiClient(PublisherMessagingApi);
      return await apiClient.apiV1PublisherMessagingConversationsConversationIdMessagesPost({
        conversationId: parseInt(conversationId),
        request: messageData,
      });
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to send message:', error);
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      content: newMessage,
      messageType: 'text',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'closed': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive">Failed to load conversation details.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/conversations">Back to Conversations</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const conversation = conversationData?.conversation;
  const messages = conversationData?.messages || [];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/conversations">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Conversations
          </Link>
        </Button>
      </div>

      {/* Conversation Info */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{conversation?.subject || 'Conversation'}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">
                  Publisher: {conversation?.publisherDomain}
                </span>
                {conversation?.status && (
                  <Badge variant="secondary" className={getStatusColor(conversation.status)}>
                    {conversation.status}
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Created: {formatDate(conversation?.createdAt)}</div>
              <div>Messages: {conversation?.messageCount || 0}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No messages in this conversation yet.
              </p>
            ) : (
              messages.map((message, index) => (
                <div key={message.messageId || index} className="space-y-2">
                  <div className={`flex ${message.senderType === 'advertiser' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderType === 'advertiser' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">
                          {message.senderType === 'advertiser' ? 'You' : 'Publisher'}
                        </span>
                        <span className="text-xs opacity-70">
                          {message.sentAt ? formatDate(message.sentAt) : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < messages.length - 1 && <Separator />}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationDetail;