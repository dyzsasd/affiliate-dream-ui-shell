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
  vertical: string;
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

// All available verticals
const allVerticals = [
  "Business / Cloud Storage",
  "Business / Creative Tools",
  "Business / CRM Tools",
  "Business / Cyber Security",
  "Business / Ecommerce",
  "Business / Editing Software",
  "Business / Email Hosting Services",
  "Business / Email Marketing Tools",
  "Business / Expense Management",
  "Business / Jobs & Careers",
  "Business / Marketing Tools",
  "Business / Office",
  "Business / Online Security",
  "Business / Online Training",
  "Business / Password Managers",
  "Business / Productivity Tools",
  "Business / SEO & SEM Tools",
  "Business / Services",
  "Business / Social Media Tools",
  "Business / Website Builder",
  "Education / Languages",
  "Education / Online Courses & Learning Platforms",
  "Education / Professional Development & Training",
  "Education / Textbooks & Study Aids",
  "Entertainment / Arts & Crafts",
  "Entertainment / Books",
  "Entertainment / Comics & Manga",
  "Entertainment / Gaming",
  "Entertainment / Hobbies",
  "Entertainment / Movies",
  "Entertainment / Music",
  "Entertainment / Podcasts & Audiobooks",
  "Entertainment / Puzzles & Board Games",
  "Entertainment / Streaming Services",
  "Entertainment / Tickets",
  "Fashion / Accessories",
  "Fashion / Clothing",
  "Fashion / Jewellery",
  "Fashion / Lingerie",
  "Fashion / Maternity",
  "Fashion / Shoes",
  "Fashion / Sportswear",
  "Finance / Accounts",
  "Finance / B2B Financial Services",
  "Finance / Banking",
  "Finance / Cards",
  "Finance / Currency",
  "Finance / Forex & Crypto",
  "Finance / Forex & Crypto Prop",
  "Finance / Insurance",
  "Finance / Investments",
  "Finance / Mortgages & Loans",
  "Finance / Stock Trading & Brokerage",
  "Finance / Wills",
  "Food / Alcohol",
  "Food / Confectionery",
  "Food / Cooking Appliances & Tools",
  "Food / Drinks",
  "Food / Groceries",
  "Food / Meal Kits & Prepared Meals",
  "Food / Take Out",
  "Gambling / Bingo",
  "Gambling / Casino",
  "Gambling / Lottery",
  "Gambling / Sportsbook",
  "Gifts / Experience Days",
  "Gifts / Flowers",
  "Gifts / Personalised Gifts",
  "Health & Beauty / Beauty & Skincare",
  "Health & Beauty / CBD",
  "Health & Beauty / Dental Care",
  "Health & Beauty / Eyecare",
  "Health & Beauty / Fitness",
  "Health & Beauty / Fragrances",
  "Health & Beauty / Healthcare Services & Telehealth",
  "Health & Beauty / Mental Wellness",
  "Health & Beauty / Sexual Wellness",
  "Health & Beauty / Vitamins & Supplements",
  "Health & Beauty / Weight Loss",
  "Home & Garden / Appliances & Electricals",
  "Home & Garden / Art & Decor",
  "Home & Garden / Beds & Bedding",
  "Home & Garden / DIY & Hardware",
  "Home & Garden / Furniture",
  "Home & Garden / Garden & Outdoor",
  "Home & Garden / Home Security",
  "Home & Garden / Homeware & Kitchen",
  "Home & Garden / Pets",
  "Home & Garden / Services",
  "Home & Garden / Smart Home Technology",
  "Home & Garden / Solar & Renewables",
  "Home & Garden / Utilities & Energy",
  "Kids & Baby / Babysitters",
  "Kids & Baby / Child Safety",
  "Kids & Baby / Family Services",
  "Kids & Baby / Kids' Clothing",
  "Kids & Baby / Maternity",
  "Kids & Baby / Nursery & Care",
  "Kids & Baby / Toys & Gifts",
  "Legal Services / Business Formation",
  "Legal Services / Personal Legal Services",
  "Motoring / Breakdown Cover",
  "Motoring / Car Parts & Accessories",
  "Motoring / Car Sales & Leasing",
  "Motoring / Motorcycles",
  "Online / Cyber Security",
  "Online / Dating",
  "Online / Freebies & Surveys",
  "Online / Services",
  "Online / VPNs & Online Privacy",
  "Online / Web Design",
  "Online / Web Hosting",
  "Property / Commercial Real Estate",
  "Property / Property Services",
  "Property / Sales & Lettings",
  "Shopping / Department Stores",
  "Shopping / Luxury Goods",
  "Shopping / Wedding",
  "Software & SaaS / AI Tools",
  "Software & SaaS / Creative",
  "Software & SaaS / Editing Software",
  "Software & SaaS / Marketing",
  "Software & SaaS / Productivity",
  "Software & SaaS / Security",
  "Sports / Cycling",
  "Sports / Equipment",
  "Sports / Fitness",
  "Sports / Hunting",
  "Sports / Outdoor",
  "Technology / Appliances & Electricals",
  "Technology / Computers & Laptops",
  "Technology / eSIM",
  "Technology / Gadgets & Accessories",
  "Technology / Mobile & Broadband",
  "Travel / Accessories & Luggage",
  "Travel / Accommodation",
  "Travel / Airport Parking & Transfers",
  "Travel / Attractions & Tours",
  "Travel / Car Hire",
  "Travel / Cruises",
  "Travel / Ferries",
  "Travel / Flights",
  "Travel / Rail & Coach",
  "Travel / Vacation Packages"
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
          <Label htmlFor="vertical">{t("marketplace.verticals")}</Label>
          <Select value={filters.vertical} onValueChange={(value) => updateFilter("vertical", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("marketplace.selectVertical")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("marketplace.allVerticals")}</SelectItem>
              {allVerticals.map((vertical) => (
                <SelectItem key={vertical} value={vertical}>
                  {vertical}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default RealPublisherFilters;