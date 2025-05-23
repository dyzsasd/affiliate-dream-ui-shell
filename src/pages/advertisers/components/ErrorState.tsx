
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  error?: Error;
  onRetry?: () => void;
  isNotFound?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, isNotFound = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isNotFound) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive font-medium">
          {t('advertisers.notFound')}
        </p>
        <Button variant="outline" onClick={() => navigate('/advertisers')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('advertisers.backToList')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-destructive font-medium">
        {error instanceof Error ? error.message : t('common.errorOccurred')}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('common.tryAgain')}
        </Button>
      )}
    </div>
  );
};
