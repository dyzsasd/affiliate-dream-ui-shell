
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, TrendingUp, Eye, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Publisher } from "../types/publisher";

interface PublisherCardProps {
  publisher: Publisher;
  viewMode: "grid" | "list";
  onViewDetails: () => void;
}

// Default placeholder for logos
const defaultLogo = "/placeholder.svg";

const PublisherCard: React.FC<PublisherCardProps> = ({
  publisher,
  viewMode,
  onViewDetails
}) => {
  const { t } = useTranslation();
  const logoUrl = publisher.logo || defaultLogo;

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={logoUrl} alt={publisher.name} />
                <AvatarFallback>{publisher.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold truncate">{publisher.name}</h3>
                  {publisher.isVerified && (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {publisher.country}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {publisher.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {(publisher.monthlyTraffic / 1000000).toFixed(1)}M {t("marketplace.monthlyTraffic")}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {publisher.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {publisher.categories.slice(0, 3).map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {publisher.categories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{publisher.categories.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-right">
              <Button onClick={onViewDetails}>
                {t("marketplace.viewDetails")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={logoUrl} alt={publisher.name} />
            <AvatarFallback>{publisher.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          {publisher.isVerified && (
            <CheckCircle className="h-4 w-4 text-blue-500" />
          )}
        </div>
        
        <h3 className="font-semibold mb-2 line-clamp-1">{publisher.name}</h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3 w-3" />
          {publisher.country}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {publisher.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {publisher.categories.slice(0, 2).map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
          {publisher.categories.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{publisher.categories.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{publisher.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>{(publisher.monthlyTraffic / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button onClick={onViewDetails} className="w-full">
          {t("marketplace.viewDetails")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PublisherCard;
