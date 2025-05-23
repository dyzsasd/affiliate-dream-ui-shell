
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchAdvertiser } from '@/services/advertiserService';
import { DomainAdvertiser } from '@/generated-api/src/models';

interface UseAdvertiserDetailResult {
  advertiser: DomainAdvertiser | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  advertiserId: string | undefined;
}

export const useAdvertiserDetail = (): UseAdvertiserDetailResult => {
  const { advertiserId } = useParams<{ advertiserId: string }>();
  
  const { 
    data: advertiser, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['advertiser', advertiserId],
    queryFn: () => fetchAdvertiser(Number(advertiserId)),
    enabled: !!advertiserId,
  });

  return {
    advertiser,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    advertiserId
  };
};
