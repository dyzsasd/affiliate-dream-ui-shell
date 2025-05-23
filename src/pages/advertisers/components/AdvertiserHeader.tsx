
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DomainAdvertiser } from '@/generated-api/src/models';

interface AdvertiserHeaderProps {
  advertiser: DomainAdvertiser;
}

export const AdvertiserHeader: React.FC<AdvertiserHeaderProps> = ({ advertiser }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/advertisers')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
      </div>

      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{advertiser.name}</CardTitle>
          <CardDescription>
            {t('advertisers.advertiserDetails')}
          </CardDescription>
        </div>
        <Badge variant="outline" className={getStatusColor(advertiser.status)}>
          {advertiser.status}
        </Badge>
      </CardHeader>
    </>
  );
};
