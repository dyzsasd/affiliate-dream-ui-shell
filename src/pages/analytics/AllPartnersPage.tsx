
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createApiClient } from '@/services/backendApi';
import { AnalyticsApi } from '@/generated-api/src/apis/AnalyticsApi';
import type { DomainAnalyticsPublisherResponse } from '@/generated-api/src/models';
import RealPublisherCard from '@/pages/marketplace/components/RealPublisherCard';
import RealPublisherDetailPanel from '@/pages/marketplace/components/RealPublisherDetailPanel';
import { useToast } from '@/hooks/use-toast';

const AllPartnersPage: React.FC = () => {
  const { advertiserId } = useParams<{ advertiserId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [selectedPublisher, setSelectedPublisher] = useState<DomainAnalyticsPublisherResponse | null>(null);
  const [partners, setPartners] = useState<DomainAnalyticsPublisherResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [failedDomains, setFailedDomains] = useState<Set<string>>(new Set());
  const [allPartnerDomains, setAllPartnerDomains] = useState<string[]>([]);

  const batchSize = 10;

  // Query for advertiser details to get partner domains
  const { data: advertiserData, isLoading: advertiserLoading } = useQuery({
    queryKey: ['advertiser-analytics', advertiserId],
    queryFn: async () => {
      if (!advertiserId) return null;
      
      const apiClient = await createApiClient(AnalyticsApi);
      const response = await apiClient.apiV1AnalyticsAdvertisersIdGet({
        id: parseInt(advertiserId)
      });
      
      return response.data;
    },
    enabled: !!advertiserId,
  });

  // Extract partner domains from advertiser data
  const extractPartnerDomains = useCallback(() => {
    if (!advertiserData?.advertiser) return [];
    
    console.log('Advertiser data:', advertiserData);
    
    // Try to extract domains from various possible locations in the response
    const advertiser = advertiserData.advertiser as any;
    let domains: string[] = [];
    
    // Check partnerInformation structure
    if (advertiser.partnerInformation?.promotypeMix?.value) {
      domains = advertiser.partnerInformation.promotypeMix.value
        .flatMap((promotype: any) => promotype.value || [])
        .filter(Boolean);
    }
    
    // Check other possible locations for partner data
    if (domains.length === 0 && advertiser.partners) {
      domains = advertiser.partners.map((partner: any) => partner.domain).filter(Boolean);
    }
    
    // Check affiliateMix if available
    if (domains.length === 0 && advertiser.affiliateMix?.value) {
      domains = advertiser.affiliateMix.value
        .map((item: any) => item.domain)
        .filter(Boolean);
    }
    
    console.log('Extracted domains:', domains);
    return [...new Set(domains)]; // Remove duplicates
  }, [advertiserData]);

  // Initialize partner domains when advertiser data loads
  useEffect(() => {
    if (advertiserData) {
      const domains = extractPartnerDomains();
      setAllPartnerDomains(domains);
      setHasMore(domains.length > 0);
      console.log('All partner domains:', domains);
    }
  }, [advertiserData, extractPartnerDomains]);

  // Fetch publisher details for a batch of domains
  const fetchPublisherBatch = async (domains: string[]) => {
    const apiClient = await createApiClient(AnalyticsApi);
    const results: DomainAnalyticsPublisherResponse[] = [];
    
    for (const domain of domains) {
      try {
        console.log(`Fetching data for domain: ${domain}`);
        const response = await apiClient.apiV1AnalyticsAffiliatesDomainDomainGet({
          domain
        });
        if (response.data) {
          results.push(response.data);
        }
      } catch (error) {
        console.error(`Failed to fetch data for domain ${domain}:`, error);
        setFailedDomains(prev => new Set([...prev, domain]));
      }
    }

    return results;
  };

  // Load next batch of partners
  const loadNextBatch = async () => {
    if (loadingMore || !hasMore || allPartnerDomains.length === 0) return;

    const startIndex = currentBatch * batchSize;
    const endIndex = startIndex + batchSize;
    const batchDomains = allPartnerDomains.slice(startIndex, endIndex);
    
    if (batchDomains.length === 0) {
      setHasMore(false);
      return;
    }

    if (currentBatch === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const batchResults = await fetchPublisherBatch(batchDomains);
      
      setPartners(prev => [...prev, ...batchResults]);
      setCurrentBatch(prev => prev + 1);
      setHasMore(endIndex < allPartnerDomains.length);
      
      console.log(`Loaded batch ${currentBatch + 1}, got ${batchResults.length} publishers`);
    } catch (error) {
      console.error('Error loading partner batch:', error);
      toast({
        title: "Error",
        description: "Failed to load partners. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load first batch when domains are available
  useEffect(() => {
    if (allPartnerDomains.length > 0 && currentBatch === 0) {
      loadNextBatch();
    }
  }, [allPartnerDomains]);

  const getDisplayName = () => {
    return (advertiserData?.advertiser as any)?.name || 
           (advertiserData?.advertiser as any)?.domain || 
           'Advertiser';
  };

  if (advertiserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/analytics/advertiser/${advertiserId}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('analytics.allPartnersFor')} {getDisplayName()}
          </h1>
          <p className="text-muted-foreground">
            {t('analytics.allPartnersDescription')}
          </p>
        </div>
      </div>

      {/* Failed Domains Alert */}
      {failedDomains.size > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <p className="text-sm text-orange-800">
              {t('analytics.somePartnersFailedToLoad', { count: failedDomains.size })}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `Showing ${partners.length} partners`}
            {allPartnerDomains.length > 0 && ` of ${allPartnerDomains.length} total`}
          </p>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </div>

      {/* Partners List */}
      {!loading && partners.length === 0 && allPartnerDomains.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-4 text-6xl">📊</div>
              <h3 className="mb-2 text-lg font-semibold">No Partners Found</h3>
              <p className="text-muted-foreground mb-4">
                This advertiser doesn't have any partner data available.
              </p>
              <Button onClick={() => navigate(`/analytics/advertiser/${advertiserId}`)} variant="outline">
                Back to Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 grid-cols-1">
            {partners.map((publisher, index) => (
              <RealPublisherCard
                key={`${publisher.publisher?.domain}-${index}`}
                publisher={publisher}
                viewMode="list"
                onViewDetails={() => setSelectedPublisher(publisher)}
              />
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={loadNextBatch}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading More...
                  </>
                ) : (
                  `Load More Partners (${Math.min(batchSize, allPartnerDomains.length - partners.length)} remaining)`
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Publisher Detail Panel */}
      {selectedPublisher && (
        <RealPublisherDetailPanel
          publisher={selectedPublisher}
          isOpen={!!selectedPublisher}
          onClose={() => setSelectedPublisher(null)}
        />
      )}
    </div>
  );
};

export default AllPartnersPage;
