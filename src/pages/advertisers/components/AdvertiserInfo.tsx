
import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CardContent } from '@/components/ui/card';
import { DomainAdvertiser } from '@/generated-api/src/models';

interface AdvertiserInfoProps {
  advertiser: DomainAdvertiser;
}

export const AdvertiserInfo: React.FC<AdvertiserInfoProps> = ({ advertiser }) => {
  const { t } = useTranslation();

  // Format the billing details for display if available
  const formatBillingDetails = () => {
    if (advertiser.billingDetails) {
      try {
        const billingObj = JSON.parse(advertiser.billingDetails);
        return (
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(billingObj, null, 2)}
          </pre>
        );
      } catch (e) {
        return (
          <p className="text-destructive">{t('common.error')}: {t('common.errorOccurred')}</p>
        );
      }
    }
    return null;
  };

  return (
    <CardContent className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          {t('advertisers.basicInfo')}
        </h3>
        <div className="bg-muted/50 rounded-md p-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium">{t('advertisers.idLabel')}</p>
            <p className="text-sm text-muted-foreground">{advertiser.advertiserId}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('advertisers.orgIdLabel')}</p>
            <p className="text-sm text-muted-foreground">{advertiser.organizationId}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('advertisers.createdLabel')}</p>
            <p className="text-sm text-muted-foreground">
              {advertiser.createdAt 
                ? format(new Date(advertiser.createdAt), 'PPpp') 
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('advertisers.updatedLabel')}</p>
            <p className="text-sm text-muted-foreground">
              {advertiser.updatedAt 
                ? format(new Date(advertiser.updatedAt), 'PPpp') 
                : '-'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          {t('advertisers.contactInfo')}
        </h3>
        <div className="bg-muted/50 rounded-md p-4">
          <div>
            <p className="text-sm font-medium">{t('advertisers.emailLabel')}</p>
            <p className="text-sm">{advertiser.contactEmail || '-'}</p>
          </div>
        </div>
      </div>

      {advertiser.billingDetails && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            {t('advertisers.billingDetailsLabel')}
          </h3>
          <div className="bg-muted/50 rounded-md p-4">
            {formatBillingDetails()}
          </div>
        </div>
      )}
    </CardContent>
  );
};
