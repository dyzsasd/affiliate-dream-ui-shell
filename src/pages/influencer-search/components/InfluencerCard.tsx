import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Users, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Influencer } from "../types/influencer";

interface InfluencerCardProps {
  influencer: Influencer;
  viewMode: "grid" | "list";
}

const InfluencerCard: React.FC<InfluencerCardProps> = ({
  influencer,
  viewMode
}) => {
  const navigate = useNavigate();
  const primarySocialMedia = influencer.socialMediaProfiles[0];
  
  const handleViewDetails = () => {
    navigate(`/influencer-search/${influencer.id}`);
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return '📱';
      case 'linkedin':
        return '💼';
      case 'youtube':
        return '🎥';
      case 'instagram':
        return '📸';
      default:
        return '🌐';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={influencer.avatar} alt={influencer.name} />
                  <AvatarFallback>{influencer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {influencer.isVerified && (
                  <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-blue-500 bg-white rounded-full" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold truncate">{influencer.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {influencer.location}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {influencer.bio}
                </p>
                
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-orange-500">⭐</span>
                    <span className="font-medium">{influencer.category}</span>
                    <span className="text-muted-foreground">+1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">🌍</span>
                    <span>{influencer.language}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {influencer.industries.slice(0, 3).map((industry) => (
                    <Badge key={industry} variant="secondary" className="text-xs">
                      {industry}
                    </Badge>
                  ))}
                </div>
                
                {/* Social Media Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getPlatformIcon(primarySocialMedia.platform)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{(primarySocialMedia.followers / 1000).toFixed(1)}K</span>
                        <span className={cn("font-medium", getScoreColor(primarySocialMedia.score))}>
                          {primarySocialMedia.score}/100
                        </span>
                        <span className={cn("text-xs", getGrowthColor(primarySocialMedia.growth))}>
                          {primarySocialMedia.growth > 0 ? '+' : ''}{primarySocialMedia.growth.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3 ml-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Influence Score</div>
                <div className="text-2xl font-bold text-blue-600">{influencer.influenceScore}</div>
                <div className="text-xs text-muted-foreground">{influencer.totalPoints.toLocaleString()} pts</div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-1" />
                  CRM
                </Button>
                <Button size="sm" onClick={handleViewDetails}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="relative inline-block mb-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={influencer.avatar} alt={influencer.name} />
              <AvatarFallback>{influencer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {influencer.isVerified && (
              <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-blue-500 bg-white rounded-full" />
            )}
          </div>
          
          <h3 className="font-semibold mb-1">{influencer.name}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {influencer.bio}
          </p>
          
          <div className="text-xs text-muted-foreground mb-3">
            {influencer.location} • {influencer.language}
          </div>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-sm text-muted-foreground">Influence Score</div>
          <div className="text-xl font-bold text-blue-600">{influencer.influenceScore}</div>
          <div className="text-xs text-muted-foreground">{influencer.totalPoints.toLocaleString()} pts</div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-lg">{getPlatformIcon(primarySocialMedia.platform)}</span>
          <span className="text-sm font-medium">{(primarySocialMedia.followers / 1000).toFixed(1)}K</span>
          <Badge variant="outline" className={cn("text-xs", getScoreColor(primarySocialMedia.score))}>
            {primarySocialMedia.score}/100
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Users className="h-4 w-4 mr-1" />
            CRM
          </Button>
          <Button size="sm" onClick={handleViewDetails} className="flex-1">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluencerCard;
