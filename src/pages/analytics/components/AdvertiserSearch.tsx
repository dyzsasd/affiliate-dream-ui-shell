import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { createApiClient } from '@/services/backendApi';
import { AnalyticsApi } from '@/generated-api/src/apis/AnalyticsApi';
import { DomainAutocompleteResult } from '@/generated-api/src/models/DomainAutocompleteResult';
import { useQuery } from '@tanstack/react-query';

interface AdvertiserSearchProps {
  onSelect: (advertiser: DomainAutocompleteResult) => void;
}

const AdvertiserSearch: React.FC<AdvertiserSearchProps> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Query for autocomplete results
  const { data: autocompleteResults, isLoading } = useQuery({
    queryKey: ['advertiser-autocomplete', searchValue],
    queryFn: async () => {
      if (searchValue.length < 3) return [];
      
      const apiClient = await createApiClient(AnalyticsApi);
      const response = await apiClient.apiV1AnalyticsAutocompleteGet({
        q: searchValue,
        type: 'advertiser', // Filter to only advertisers
        limit: 10
      });
      
      // Filter results to only show advertisers
      return response.data?.filter(item => item.type === 'advertiser') || [];
    },
    enabled: searchValue.length >= 3,
    staleTime: 30000, // Cache for 30 seconds
  });

  useEffect(() => {
    if (searchValue.length >= 3) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchValue]);

  const handleSelect = (advertiser: DomainAutocompleteResult) => {
    onSelect(advertiser);
    setSearchValue(advertiser.name || advertiser.domain || '');
    setOpen(false);
    // Keep focus on input after selection
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const getDisplayName = (advertiser: DomainAutocompleteResult) => {
    return advertiser.name || advertiser.domain || '';
  };

  const getLogoInitial = (advertiser: DomainAutocompleteResult) => {
    const name = getDisplayName(advertiser);
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="w-full max-w-md">
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search advertiser (min 3 characters)..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 w-full"
              onFocus={() => {
                if (searchValue.length >= 3) {
                  setOpen(true);
                }
              }}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[400px] p-0" 
          align="start"
          onOpenAutoFocus={(e) => {
            // Prevent the popover from taking focus away from the input
            e.preventDefault();
          }}
        >
          <Command>
            <CommandList>
              {isLoading ? (
                <div className="py-6 text-center text-sm">Loading...</div>
              ) : !autocompleteResults || autocompleteResults.length === 0 ? (
                <CommandEmpty>No advertisers found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {autocompleteResults.map((advertiser) => (
                    <CommandItem
                      key={advertiser.id}
                      onSelect={() => handleSelect(advertiser)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {getLogoInitial(advertiser)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{getDisplayName(advertiser)}</div>
                        {advertiser.domain && (
                          <div className="text-sm text-gray-500">{advertiser.domain}</div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AdvertiserSearch;
