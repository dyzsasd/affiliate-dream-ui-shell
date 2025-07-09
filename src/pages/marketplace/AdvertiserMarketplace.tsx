
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, Star, Loader2 } from "lucide-react";

import RealPublisherCard from "./components/RealPublisherCard";
import RealPublisherFilters from "./components/RealPublisherFilters";
import RealPublisherDetailPanel from "./components/RealPublisherDetailPanel";
import { searchPublishers, type PublisherSearchParams } from "@/services/publisherService";
import type { DomainAnalyticsPublisherResponse } from '@/generated-api/src/models';
import { useToast } from "@/hooks/use-toast";

const AdvertiserMarketplace: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState<DomainAnalyticsPublisherResponse | null>(null);
  const [viewMode] = useState<"list">("list");
  const [filters, setFilters] = useState({
    country: "all",
    vertical: "all"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [publishers, setPublishers] = useState<DomainAnalyticsPublisherResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  const pageSize = 20;

  // Load publishers function
  const loadPublishers = async (page: number = 1, append: boolean = false) => {
    setLoading(true);
    try {
      const searchParams: PublisherSearchParams = {
        page,
        pageSize,
        country: filters.country && filters.country !== "all" ? filters.country : undefined,
        verticals: filters.vertical && filters.vertical !== "all" ? [filters.vertical] : undefined,
        domain: searchTerm || undefined
      };

      const result = await searchPublishers(searchParams);
      
      if (append) {
        setPublishers(prev => [...prev, ...result.publishers]);
      } else {
        setPublishers(result.publishers);
      }
      
      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading publishers:', error);
      toast({
        title: "Error",
        description: "Failed to load publishers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load publishers on component mount and filter changes
  useEffect(() => {
    loadPublishers(1, false);
  }, [filters.country, filters.vertical]);

  // Search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== undefined) {
        loadPublishers(1, false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleClearFilters = () => {
    setFilters({
      country: "all",
      vertical: "all"
    });
    setSearchTerm("");
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadPublishers(currentPage + 1, true);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.country && filters.country !== "all") count++;
    if (filters.vertical && filters.vertical !== "all") count++;
    if (searchTerm) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("marketplace.title")}</h1>
          <p className="text-muted-foreground">{t("marketplace.description")}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("marketplace.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {t("marketplace.filters")}
        </Button>
        
        {getActiveFiltersCount() > 0 && (
          <Button variant="ghost" onClick={handleClearFilters}>
            {t("marketplace.clearAll")}
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {(getActiveFiltersCount() > 0) && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t("marketplace.search")}: {searchTerm}
            </Badge>
          )}
          {filters.country && filters.country !== "all" && (
            <Badge variant="secondary">
              {t("marketplace.country")}: {filters.country}
            </Badge>
          )}
          {filters.vertical && filters.vertical !== "all" && (
            <Badge variant="secondary">
              {t("marketplace.vertical")}: {filters.vertical}
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

      {/* Results Count and Loading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `Showing ${publishers.length} publishers`}
            {totalCount > 0 && ` (${totalCount}+ total)`}
          </p>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </div>

      {/* Publishers Grid/List */}
      {!loading && publishers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="mb-2 text-lg font-semibold">{t("marketplace.noResults")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("marketplace.noResultsDescription")}
              </p>
              <Button onClick={handleClearFilters} variant="outline">
                {t("marketplace.clearFilters")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 grid-cols-1">
            {publishers.map((publisher, index) => (
              <RealPublisherCard
                key={`${publisher.publisher?.domain}-${index}`}
                publisher={publisher}
                viewMode={viewMode}
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Publishers"
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

export default AdvertiserMarketplace;
