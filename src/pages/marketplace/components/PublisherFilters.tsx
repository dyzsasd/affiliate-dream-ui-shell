
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface FiltersState {
  category: string;
  country: string;
  minEPC: string;
  minRating: string;
  payoutModel: string;
}

interface PublisherFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  onClear: () => void;
}

const PublisherFilters: React.FC<PublisherFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear
}) => {
  const { t } = useTranslation();

  const updateFilter = (key: keyof FiltersState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const categories = [
    "Technology", "Fashion", "Health", "Fitness", "Travel", 
    "Home & Garden", "Beauty", "Electronics", "Lifestyle", "Food"
  ];

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", 
    "Germany", "France", "Spain", "Italy", "Netherlands", "Sweden"
  ];

  const payoutModels = ["CPC", "CPA", "CPM", "Revenue Share"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("marketplace.advancedFilters")}</h3>
        <Button variant="ghost" onClick={onClear}>
          {t("marketplace.clearAll")}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">{t("marketplace.category")}</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("marketplace.selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("marketplace.allCategories")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">{t("marketplace.country")}</Label>
          <Select value={filters.country} onValueChange={(value) => updateFilter("country", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("marketplace.selectCountry")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("marketplace.allCountries")}</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minEPC">{t("marketplace.minimumEPC")}</Label>
          <Input
            id="minEPC"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={filters.minEPC}
            onChange={(e) => updateFilter("minEPC", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minRating">{t("marketplace.minimumRating")}</Label>
          <Select value={filters.minRating} onValueChange={(value) => updateFilter("minRating", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("marketplace.selectRating")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("marketplace.anyRating")}</SelectItem>
              <SelectItem value="4.5">4.5+ ⭐</SelectItem>
              <SelectItem value="4.0">4.0+ ⭐</SelectItem>
              <SelectItem value="3.5">3.5+ ⭐</SelectItem>
              <SelectItem value="3.0">3.0+ ⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payoutModel">{t("marketplace.payoutModel")}</Label>
          <Select value={filters.payoutModel} onValueChange={(value) => updateFilter("payoutModel", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("marketplace.selectPayoutModel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("marketplace.allPayoutModels")}</SelectItem>
              {payoutModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PublisherFilters;
