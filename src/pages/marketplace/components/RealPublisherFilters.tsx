import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface RealFiltersState {
  country: string;
  verticals: string[];
}

interface RealPublisherFiltersProps {
  filters: RealFiltersState;
  onFiltersChange: (filters: RealFiltersState) => void;
  onClear: () => void;
}

// Available countries based on common affiliate marketing countries
const availableCountries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" },
  { code: "NZ", name: "New Zealand" }
];

// Top vertical categories
const popularVerticals = [
  "Business / Ecommerce",
  "Business / Marketing Tools",
  "Entertainment / Streaming Services",
  "Entertainment / Gaming",
  "Fashion / Clothing",
  "Health & Beauty / Beauty & Skincare",
  "Health & Beauty / Fitness",
  "Technology / Computers & Laptops",
  "Travel / Accommodation",
  "Finance / Banking",
  "Finance / Investments",
  "Food / Meal Kits & Prepared Meals",
  "Home & Garden / Furniture",
  "Education / Online Courses & Learning Platforms",
  "Software & SaaS / Productivity"
];

const RealPublisherFilters: React.FC<RealPublisherFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear
}) => {
  const { t } = useTranslation();

  const updateFilter = (key: keyof RealFiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleVertical = (vertical: string) => {
    const newVerticals = filters.verticals.includes(vertical)
      ? filters.verticals.filter(v => v !== vertical)
      : [...filters.verticals, vertical];
    
    updateFilter("verticals", newVerticals);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("marketplace.advancedFilters")}</h3>
        <Button variant="ghost" onClick={onClear}>
          {t("marketplace.clearAll")}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country Filter */}
        <div className="space-y-2">
          <Label htmlFor="country">{t("marketplace.country")}</Label>
          <Select value={filters.country} onValueChange={(value) => updateFilter("country", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("marketplace.selectCountry")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("marketplace.allCountries")}</SelectItem>
              {availableCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Verticals Filter */}
        <div className="space-y-2">
          <Label>{t("marketplace.verticals")}</Label>
          <div className="max-h-64 overflow-y-auto space-y-2 border rounded-md p-3">
            {popularVerticals.map((vertical) => (
              <div key={vertical} className="flex items-center space-x-2">
                <Checkbox
                  id={vertical}
                  checked={filters.verticals.includes(vertical)}
                  onCheckedChange={() => toggleVertical(vertical)}
                />
                <Label
                  htmlFor={vertical}
                  className="text-sm font-normal cursor-pointer"
                >
                  {vertical}
                </Label>
              </div>
            ))}
          </div>
          {filters.verticals.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {filters.verticals.length} {t("marketplace.verticalsSelected")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealPublisherFilters;