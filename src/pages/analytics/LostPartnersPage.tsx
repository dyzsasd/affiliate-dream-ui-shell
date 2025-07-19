import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { createApiClient } from '@/services/backendApi';
import { AnalyticsApi } from '@/generated-api/src/apis/AnalyticsApi';
import type { DomainAnalyticsPublisherResponse } from '@/generated-api/src/models';
import RealPublisherCard from '@/pages/marketplace/components/RealPublisherCard';
import RealPublisherFilters from '@/pages/marketplace/components/RealPublisherFilters';
import RealPublisherDetailPanel from '@/pages/marketplace/components/RealPublisherDetailPanel';
import { useToast } from '@/hooks/use-toast';

const LostPartnersPage: React.FC = () => {
  const { advertiserId } = useParams<{ advertiserId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [selectedPublisher, setSelectedPublisher] = useState<DomainAnalyticsPublisherResponse | null>(null);
  const [filters, setFilters] = useState({
    country: 'all',
    vertical: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [partners, setPartners] = useState<DomainAnalyticsPublisherResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [failedDomains, setFailedDomains] = useState<Set<string>>(new Set());

  const pageSize = 20;

  // Query for advertiser details to get lost partner domains
  const { data: advertiserData } = useQuery({
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

  // Get lost partner domains from advertiser data
  const getLostPartnerDomains = useCallback(() => {
    const partnerInfo = advertiserData?.advertiser?.partnerInformation as any;
    
    // Get domains from partnersRemoved.value array
    if (partnerInfo?.partnersRemoved?.value) {
      return partnerInfo.partnersRemoved.value
        .map((partner: any) => partner.domain)
        .filter(Boolean) as string[];
    }
    
    return [];
  }, [advertiserData]);

  // Fetch publisher details for multiple domains
  const fetchPublisherBatch = async (domains: string[]) => {
    const apiClient = await createApiClient(AnalyticsApi);
    const publisherPromises = domains.map(async (domain) => {
      try {
        const response = await apiClient.apiV1AnalyticsAffiliatesDomainDomainGet({
          domain
        });
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch data for domain ${domain}:`, error);
        setFailedDomains(prev => new Set([...prev, domain]));
        return null;
      }
    });

    const results = await Promise.allSettled(publisherPromises);
    return results
      .map(result => result.status === 'fulfilled' ? result.value : null)
      .filter(Boolean) as DomainAnalyticsPublisherResponse[];
  };

  // Load partners function
  const loadPartners = async (page: number = 1, append: boolean = false) => {
    const lostPartnerDomains = getLostPartnerDomains();
    
    if (lostPartnerDomains.length === 0) {
      setPartners([]);
      setHasMore(false);
      setTotalCount(0);
      return;
    }

    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      // Calculate pagination for domains
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const domainsToFetch = lostPartnerDomains.slice(startIndex, endIndex);
      
      if (domainsToFetch.length === 0) {
        setHasMore(false);
        return;
      }

      const fetchedPartners = await fetchPublisherBatch(domainsToFetch);
      
      // Apply filters
      let filteredPartners = fetchedPartners;

      if (filters.country && filters.country !== 'all') {
        filteredPartners = filteredPartners.filter(partner => {
          const countryRankings = partner.publisher?.countryRankings?.value;
          return countryRankings?.some((ranking: any) => 
            ranking.countryCode?.toUpperCase() === filters.country.toUpperCase()
          );
        });
      }

      if (filters.vertical && filters.vertical !== 'all') {
        filteredPartners = filteredPartners.filter(partner => {
          const verticals = partner.publisher?.verticalsV2?.value;
          return verticals?.some((vertical: any) => 
            vertical.name === filters.vertical
          );
        });
      }

      if (append) {
        setPartners(prev => [...prev, ...filteredPartners]);
      } else {
        setPartners(filteredPartners);
      }
      
      setHasMore(endIndex < lostPartnerDomains.length);
      setTotalCount(lostPartnerDomains.length);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading lost partners:', error);
      toast({
        title: "Error",
        description: "Failed to load lost partners. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load partners on component mount and filter changes
  useEffect(() => {
    if (advertiserData) {
      loadPartners(1, false);
    }
  }, [advertiserData, filters.country, filters.vertical]);

  const handleClearFilters = () => {
    setFilters({
      country: 'all',
      vertical: 'all'
    });
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadPartners(currentPage + 1, true);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.country && filters.country !== 'all') count++;
    if (filters.vertical && filters.vertical !== 'all') count++;
    return count;
  };

  const getDisplayName = () => {
    return (advertiserData?.advertiser as any)?.name || (advertiserData?.advertiser as any)?.domain || 'Advertiser';
  };

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
            {t('analytics.lostPartnersFor')} {getDisplayName()}
          </h1>
          <p className="text-muted-foreground">
            {t('analytics.lostPartnersDescription')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          {t('marketplace.filters')}
        </Button>
        
        {getActiveFiltersCount() > 0 && (
          <Button variant="ghost" onClick={handleClearFilters}>
            {t('marketplace.clearAll')}
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.country && filters.country !== 'all' && (
            <Badge variant="secondary">
              {t('marketplace.country')}: {filters.country}
            </Badge>
          )}
          {filters.vertical && filters.vertical !== 'all' && (
            <Badge variant="secondary">
              {t('marketplace.vertical')}: {filters.vertical}
            </Badge>
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <RealPublisherFilters 
              filters={filters} 
              onFiltersChange={setFilters}
              onClear={handleClearFilters}
            />
          </CardContent>
        </Card>
      )}

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

      {/* Results Count and Loading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `Showing ${partners.length} lost partners`}
            {totalCount > 0 && ` (${totalCount} total)`}
          </p>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </div>

      {/* Partners List */}
      {!loading && partners.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-4 text-6xl">🎯</div>
              <h3 className="mb-2 text-lg font-semibold">{t('analytics.noLostPartners')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('analytics.noLostPartnersDescription')}
              </p>
              <Button onClick={handleClearFilters} variant="outline">
                {t('marketplace.clearFilters')}
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
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Partners"
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

export default LostPartnersPage;