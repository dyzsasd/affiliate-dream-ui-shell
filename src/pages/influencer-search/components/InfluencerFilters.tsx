
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SearchFilters } from "../types/influencer";

interface InfluencerFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClear: () => void;
}

const InfluencerFilters: React.FC<InfluencerFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear
}) => {
  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const socialMediaPlatforms = [
    { name: 'Instagram', icon: '📸' },
    { name: 'TikTok', icon: '📱' },
    { name: 'YouTube', icon: '🎥' },
    { name: 'Twitter', icon: '🐦' },
    { name: 'LinkedIn', icon: '💼' },
    { name: 'Twitch', icon: '🎮' },
    { name: 'Snapchat', icon: '👻' }
  ];

  const industries = [
    "Technology", "Fashion", "Health", "Fitness", "Travel", 
    "Home & Garden", "Beauty", "Electronics", "Lifestyle", 
    "Food", "Music", "Entertainment", "Business", "Education"
  ];

  const languages = [
    "English", "Spanish", "French", "German", "Italian", 
    "Portuguese", "Chinese", "Japanese", "Korean", "Arabic", "Hebrew"
  ];

  const regions = [
    "North America", "Europe", "Asia", "South America", 
    "Africa", "Oceania", "Middle East"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Advanced Filters</h3>
        <Button variant="ghost" onClick={onClear}>
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gender */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Gender</Label>
          <div className="flex gap-2">
            {['all', 'male', 'female'].map((gender) => (
              <Button
                key={gender}
                variant={filters.gender === gender ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter('gender', gender as any)}
                className="capitalize"
              >
                {gender}
              </Button>
            ))}
          </div>
        </div>

        {/* Profile Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Profile type</Label>
          <div className="flex gap-2">
            {['all', 'creators', 'brands'].map((type) => (
              <Button
                key={type}
                variant={filters.profileType === type ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter('profileType', type as any)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Industries</Label>
          <Select value={filters.industry} onValueChange={(value) => updateFilter('industry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Regions</Label>
          <Select value={filters.region} onValueChange={(value) => updateFilter('region', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">City</Label>
          <Input 
            placeholder="Type a city name"
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
          />
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Languages</Label>
          <Select value={filters.language} onValueChange={(value) => updateFilter('language', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Social Media Platforms */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Filters for specific social medias</Label>
        <div className="flex flex-wrap gap-3">
          {socialMediaPlatforms.map((platform) => (
            <Button
              key={platform.name}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <span>{platform.icon}</span>
              <span>{platform.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Followers Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Followers</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="Min"
              type="number"
              value={filters.followersMin || ''}
              onChange={(e) => updateFilter('followersMin', parseInt(e.target.value) || 0)}
            />
            <Input 
              placeholder="Max"
              type="number"
              value={filters.followersMax || ''}
              onChange={(e) => updateFilter('followersMax', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Growth %</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="Min"
              type="number"
              value={filters.growthMin || ''}
              onChange={(e) => updateFilter('growthMin', parseInt(e.target.value) || 0)}
            />
            <Input 
              placeholder="Max"
              type="number"
              value={filters.growthMax || ''}
              onChange={(e) => updateFilter('growthMax', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Toggle Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Hide creators already in your CRM</Label>
          <Switch 
            checked={filters.hideInCRM}
            onCheckedChange={(checked) => updateFilter('hideInCRM', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Only show active accounts (posted last month)</Label>
          <Switch 
            checked={filters.onlyActiveAccounts}
            onCheckedChange={(checked) => updateFilter('onlyActiveAccounts', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Only show profiles with an email</Label>
          <Switch 
            checked={filters.onlyWithEmail}
            onCheckedChange={(checked) => updateFilter('onlyWithEmail', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Only show Favikon Verified creators</Label>
          <Switch 
            checked={filters.onlyVerified}
            onCheckedChange={(checked) => updateFilter('onlyVerified', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default InfluencerFilters;
