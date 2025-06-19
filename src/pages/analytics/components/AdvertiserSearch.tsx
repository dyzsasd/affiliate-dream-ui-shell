
import React, { useState, useEffect } from 'react';
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

interface Advertiser {
  id: number;
  domain: string;
  name: string;
  logo: string;
}

interface AdvertiserSearchProps {
  onSelect: (advertiser: Advertiser) => void;
  advertisers: Advertiser[];
}

const AdvertiserSearch: React.FC<AdvertiserSearchProps> = ({ onSelect, advertisers }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredAdvertisers, setFilteredAdvertisers] = useState<Advertiser[]>([]);

  useEffect(() => {
    if (searchValue.length >= 3) {
      const filtered = advertisers.filter(advertiser =>
        advertiser.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        advertiser.domain.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredAdvertisers(filtered);
      setOpen(true);
    } else {
      setFilteredAdvertisers([]);
      setOpen(false);
    }
  }, [searchValue, advertisers]);

  const handleSelect = (advertiser: Advertiser) => {
    onSelect(advertiser);
    setSearchValue(advertiser.name);
    setOpen(false);
  };

  return (
    <div className="w-full max-w-md">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search advertiser (min 3 characters)..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandList>
              {filteredAdvertisers.length === 0 ? (
                <CommandEmpty>No advertisers found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredAdvertisers.map((advertiser) => (
                    <CommandItem
                      key={advertiser.id}
                      onSelect={() => handleSelect(advertiser)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{advertiser.logo}</span>
                      </div>
                      <div>
                        <div className="font-medium">{advertiser.name}</div>
                        <div className="text-sm text-gray-500">{advertiser.domain}</div>
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
