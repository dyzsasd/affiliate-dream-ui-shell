import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PublisherMessagingApi } from "@/generated-api/src/apis/PublisherMessagingApi";
import { createApiClient } from "@/services/backendApi";

const ConversationsList: React.FC = () => {
  const { t } = useTranslation(["conversations", "common"]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: conversationsData, isLoading, error } = useQuery({
    queryKey: ['conversations', page, pageSize],
    queryFn: async () => {
      const apiClient = await createApiClient(PublisherMessagingApi);
      return await apiClient.apiV1PublisherMessagingConversationsGet({
        page,
        pageSize,
      });
    },
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'closed':
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("conversations:title")}</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("conversations:title")}</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">{t("common:error")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const conversations = conversationsData?.conversations || [];
  const totalPages = Math.ceil((conversationsData?.total || 0) / pageSize);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("conversations:title")}</h1>
      </div>

      {conversations.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">{t("conversations:noConversations")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <Card key={conversation.conversationId} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{conversation.subject}</CardTitle>
                  <Badge className={getStatusColor(conversation.status)}>
                    {t(`conversations:status.${conversation.status}`)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">{t("conversations:publisherDomain")}:</span>{" "}
                    {conversation.publisherDomain}
                  </div>
                  <div>
                    <span className="font-medium">{t("conversations:messageCount")}:</span>{" "}
                    {conversation.messageCount || 0}
                  </div>
                  <div>
                    <span className="font-medium">{t("conversations:lastMessage")}:</span>{" "}
                    {formatDate(conversation.lastMessageAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            {t("common:previous")}
          </Button>
          <span className="flex items-center px-3">
            {t("common:pageOf", { current: page, total: totalPages })}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            {t("common:next")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConversationsList;