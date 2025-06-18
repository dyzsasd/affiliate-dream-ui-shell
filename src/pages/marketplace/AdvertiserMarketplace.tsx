
import React, { useState } from "react";
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
import { Search, Filter, Grid, List, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import PublisherCard from "./components/PublisherCard";
import PublisherFilters from "./components/PublisherFilters";
import PublisherDetailPanel from "./components/PublisherDetailPanel";
import { mockPublishers } from "./data/mockPublishers";
import { Publisher } from "./types/publisher";

const AdvertiserMarketplace: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    category: "",
    country: "",
    minEPC: "",
    minRating: "",
    payoutModel: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter publishers based on search and filters
  const filteredPublishers = mockPublishers.filter(publisher => {
    const matchesSearch = publisher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         publisher.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !filters.category || publisher.categories.includes(filters.category);
    const matchesCountry = !filters.country || publisher.country === filters.country;
    const matchesEPC = !filters.minEPC || publisher.averageEPC >= parseFloat(filters.minEPC);
    const matchesRating = !filters.minRating || publisher.rating >= parseFloat(filters.minRating);
    
    return matchesSearch && matchesCategory && matchesCountry && matchesEPC && matchesRating;
  });

  const handleClearFilters = () => {
    setFilters({
      category: "",
      country: "",
      minEPC: "",
      minRating: "",
      payoutModel: ""
    });
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("marketplace.title")}</h1>
          <p className="text-muted-foreground">{t("marketplace.description")}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
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
        
        {(Object.values(filters).some(f => f) || searchTerm) && (
          <Button variant="ghost" onClick={handleClearFilters}>
            {t("marketplace.clearAll")}
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {(Object.values(filters).some(f => f) || searchTerm) && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t("marketplace.search")}: {searchTerm}
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary">
              {t("marketplace.category")}: {filters.category}
            </Badge>
          )}
          {filters.country && (
            <Badge variant="secondary">
              {t("marketplace.country")}: {filters.country}
            </Badge>
          )}
          {filters.minEPC && (
            <Badge variant="secondary">
              {t("marketplace.minEPC")}: ${filters.minEPC}
            </Badge>
          )}
          {filters.minRating && (
            <Badge variant="secondary">
              {t("marketplace.minRating")}: {filters.minRating}+ <Star className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <PublisherFilters 
              filters={filters} 
              onFiltersChange={setFilters}
              onClear={handleClearFilters}
            />
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("marketplace.showingResults", { 
            count: filteredPublishers.length,
            total: mockPublishers.length 
          })}
        </p>
        
        <Select defaultValue="relevance">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("marketplace.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">{t("marketplace.sortRelevance")}</SelectItem>
            <SelectItem value="rating">{t("marketplace.sortRating")}</SelectItem>
            <SelectItem value="epc">{t("marketplace.sortEPC")}</SelectItem>
            <SelectItem value="conversionRate">{t("marketplace.sortConversionRate")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Publishers Grid/List */}
      {filteredPublishers.length === 0 ? (
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
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        )}>
          {filteredPublishers.map((publisher) => (
            <PublisherCard
              key={publisher.id}
              publisher={publisher}
              viewMode={viewMode}
              onViewDetails={() => setSelectedPublisher(publisher)}
            />
          ))}
        </div>
      )}

      {/* Publisher Detail Panel */}
      {selectedPublisher && (
        <PublisherDetailPanel
          publisher={selectedPublisher}
          isOpen={!!selectedPublisher}
          onClose={() => setSelectedPublisher(null)}
        />
      )}
    </div>
  );
};

export default AdvertiserMarketplace;
