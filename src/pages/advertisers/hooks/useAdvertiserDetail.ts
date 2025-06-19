
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
  
  console.log('useAdvertiserDetail - advertiserId from params:', advertiserId);
  
  const { 
    data: advertiser, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['advertiser', advertiserId],
    queryFn: () => {
      console.log('Fetching advertiser with ID:', advertiserId);
      return fetchAdvertiser(Number(advertiserId));
    },
    enabled: !!advertiserId,
  });

  console.log('useAdvertiserDetail - advertiser data:', advertiser);
  console.log('useAdvertiserDetail - isLoading:', isLoading);
  console.log('useAdvertiserDetail - isError:', isError);

  return {
    advertiser,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    advertiserId
  };
};
