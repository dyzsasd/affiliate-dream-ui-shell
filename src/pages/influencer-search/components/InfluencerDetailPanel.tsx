
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  MapPin, 
  Users, 
  TrendingUp, 
  Mail, 
  Edit,
  X
} from "lucide-react";
import { Influencer } from "../types/influencer";

interface InfluencerDetailPanelProps {
  influencer: Influencer;
  isOpen: boolean;
  onClose: () => void;
}

const InfluencerDetailPanel: React.FC<InfluencerDetailPanelProps> = ({
  influencer,
  isOpen,
  onClose
}) => {
  const primarySocial = influencer.socialMediaProfiles[0];
  
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok': return '📱';
      case 'linkedin': return '💼';
      case 'youtube': return '🎥';
      case 'instagram': return '📸';
      default: return '🌐';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBrandSafetyColor = (safety: string) => {
    switch (safety) {
      case 'Very safe': return 'text-green-600';
      case 'Safe': return 'text-green-500';
      case 'Moderate': return 'text-yellow-500';
      case 'Risky': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'Very good': return 'text-green-600';
      case 'Good': return 'text-green-500';
      case 'Average': return 'text-yellow-500';
      case 'Poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-4xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={influencer.avatar} alt={influencer.name} />
                  <AvatarFallback>{influencer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {influencer.isVerified && (
                  <CheckCircle className="absolute -top-1 -right-1 h-6 w-6 text-blue-500 bg-white rounded-full" />
                )}
              </div>
              
              <div>
                <SheetTitle className="text-2xl">{influencer.name}</SheetTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    <span className="mr-1">⭐</span>
                    {influencer.category}
                  </Badge>
                  <span className="text-muted-foreground">+1</span>
                </div>
                <p className="text-muted-foreground mt-1">{influencer.bio}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <span>🇮🇱</span> {influencer.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🌍</span> {influencer.language}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Last updated {influencer.lastUpdated}</div>
              <div className="mt-2">
                <div className="text-sm text-muted-foreground">Influence Score</div>
                <div className="text-3xl font-bold text-blue-600">{influencer.influenceScore}</div>
                <div className="text-sm text-muted-foreground">{influencer.totalPoints.toLocaleString()} pts</div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Send Email
                </Button>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-1" />
                  CRM
                </Button>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b">
            <Button variant="ghost" className="border-b-2 border-blue-500 text-blue-600">
              Social Coverage
            </Button>
            <Button variant="ghost" className="text-muted-foreground">Posts</Button>
            <Button variant="ghost" className="text-muted-foreground">Creator Network</Button>
            <Button variant="ghost" className="text-muted-foreground">Audience</Button>
            <Button variant="ghost" className="text-muted-foreground">Scoring</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {influencer.quote && (
                    <blockquote className="text-center italic mb-4 p-4 bg-muted rounded-lg">
                      "{influencer.quote}"
                    </blockquote>
                  )}
                  
                  <h4 className="font-semibold mb-2">Followers</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl">
                        {getPlatformIcon(primarySocial.platform)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{(primarySocial.followers / 1000).toFixed(1)}K</div>
                        <div className="text-xs text-muted-foreground">{primarySocial.score}/100</div>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold mb-2">Profile Overview</h4>
                  <p className="text-sm text-muted-foreground">
                    {influencer.profileOverview}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Campaign Ripeness */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Influencer Campaign Ripeness
                    <span className="text-green-600 font-bold">{influencer.campaignRipeness.priceRange.split(' ')[0]}</span>
                    <span className="text-muted-foreground">/ post</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Estimated</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm font-medium">Audience Target</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {influencer.campaignRipeness.audienceTarget}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {influencer.campaignRipeness.engagementDescription}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {influencer.campaignRipeness.brandSuitability}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {influencer.campaignRipeness.partnershipLikelihood}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Content Style */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Content Style
                    <span className="text-sm font-normal text-muted-foreground">
                      {influencer.contentStyle.type}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Brand Safety</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getBrandSafetyColor(influencer.contentStyle.brandSafety)}`}>
                          {influencer.contentStyle.brandSafety}
                        </span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: '90%' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Engagement</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getEngagementColor(influencer.contentStyle.engagement)}`}>
                          {influencer.contentStyle.engagement}
                        </span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: '95%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default InfluencerDetailPanel;
