import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, Mail, UserPlus } from 'lucide-react';

interface PublisherStatusBadgeProps {
  status?: string;
  className?: string;
}

const getStatusConfig = (t: any) => ({
  added: {
    label: t('favoritePublishers.statusAdded'),
    icon: UserPlus,
    variant: 'secondary' as const,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  contacted: {
    label: t('favoritePublishers.statusContacted'),
    icon: Mail,
    variant: 'default' as const,
    color: 'text-orange-600 bg-orange-50 border-orange-200'
  },
  accepted: {
    label: t('favoritePublishers.statusAccepted'),
    icon: Check,
    variant: 'default' as const,
    color: 'text-green-600 bg-green-50 border-green-200'
  }
});

const PublisherStatusBadge: React.FC<PublisherStatusBadgeProps> = ({
  status,
  className
}) => {
  const { t } = useTranslation();
  
  if (!status) return null;

  const normalizedStatus = status.toLowerCase();
  const statusConfig = getStatusConfig(t);
  const config = statusConfig[normalizedStatus as keyof typeof statusConfig];
  
  if (!config) {
    // Fallback for unknown status
    return (
      <Badge variant="outline" className={cn("text-xs", className)}>
        {status}
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-xs font-medium flex items-center gap-1.5 px-2.5 py-1",
        config.color,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default PublisherStatusBadge;