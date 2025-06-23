
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
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
import { Search, Filter, Grid, List, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import InfluencerCard from "./components/InfluencerCard";
import InfluencerFilters from "./components/InfluencerFilters";
import { mockInfluencers } from "./data/mockInfluencers";
import { SearchFilters } from "./types/influencer";

const InfluencerSearch: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    profileType: 'creators',
    gender: 'all',
    tier: '',
    socialMedia: [],
    followersMin: 0,
    followersMax: 0,
    growthMin: 0,
    growthMax: 0,
    engagementMin: 0,
    engagementMax: 0,
    avgEngagementMin: 0,
    avgEngagementMax: 0,
    industry: '',
    region: '',
    city: '',
    language: '',
    hideInCRM: false,
    onlyActiveAccounts: false,
    onlyWithEmail: false,
    onlyVerified: true,
    sortBy: 'random'
  });

  // Filter influencers based on search and filters
  const filteredInfluencers = mockInfluencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.industries.some(industry => industry.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesProfileType = filters.profileType === 'all' || filters.profileType === 'creators';
    const matchesVerified = !filters.onlyVerified || influencer.isVerified;
    const matchesIndustry = !filters.industry || influencer.industries.includes(filters.industry);
    const matchesLanguage = !filters.language || influencer.language.toLowerCase() === filters.language.toLowerCase();
    
    return matchesSearch && matchesProfileType && matchesVerified && matchesIndustry && matchesLanguage;
  });

  const handleClearFilters = () => {
    setFilters({
      profileType: 'creators',
      gender: 'all',
      tier: '',
      socialMedia: [],
      followersMin: 0,
      followersMax: 0,
      growthMin: 0,
      growthMax: 0,
      engagementMin: 0,
      engagementMax: 0,
      avgEngagementMin: 0,
      avgEngagementMax: 0,
      industry: '',
      region: '',
      city: '',
      language: '',
      hideInCRM: false,
      onlyActiveAccounts: false,
      onlyWithEmail: false,
      onlyVerified: false,
      sortBy: 'random'
    });
    setSearchTerm("");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filters.profileType !== 'all') count++;
    if (filters.onlyVerified) count++;
    if (filters.industry) count++;
    if (filters.language) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Find the right creators according to your needs</h1>
          <p className="text-muted-foreground">Discover and connect with influencers for your campaigns</p>
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
      <div className="flex flex-col space-y-4">
        {/* Top Filter Bar */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="default" size="sm">Creators</Button>
            <Button variant="outline" size="sm">Brands</Button>
          </div>

          <Input
            placeholder="Add a keyword"
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Search
          </Button>

          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" onClick={handleClearFilters}>
              Clear All
            </Button>
          )}
        </div>

        {/* Sort and Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredInfluencers.length.toLocaleString()} results
          </p>
          
          <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by Random" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random</SelectItem>
              <SelectItem value="globalScore">Global Score</SelectItem>
              <SelectItem value="followers">Most followers</SelectItem>
              <SelectItem value="growth">Audience Growth</SelectItem>
              <SelectItem value="instagramScore">Instagram Score</SelectItem>
              <SelectItem value="tiktokScore">Tiktok Score</SelectItem>
              <SelectItem value="youtubeScore">Youtube Score</SelectItem>
              <SelectItem value="twitterScore">Twitter Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <InfluencerFilters 
              filters={filters} 
              onFiltersChange={setFilters}
              onClear={handleClearFilters}
            />
          </CardContent>
        </Card>
      )}

      {/* Influencers Grid/List */}
      {filteredInfluencers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="mb-2 text-lg font-semibold">No influencers found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        )}>
          {filteredInfluencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InfluencerSearch;
