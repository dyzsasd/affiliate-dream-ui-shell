import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  ArrowLeft,
  Users, 
  Mail, 
  Edit
} from "lucide-react";

const InfluencerDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Since mock data is removed, always return null for now
  const influencer = null;
  
  if (!influencer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('influencerDetail.influencerNotFound')}</h1>
          <Button onClick={() => navigate('/influencer')}>
            {t('influencerDetail.backToSearch')}
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/influencer')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('influencerDetail.backToSearch')}
        </Button>
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={influencer.avatar} alt={influencer.name} />
                <AvatarFallback>{influencer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {influencer.isVerified && (
                <CheckCircle className="absolute -top-1 -right-1 h-6 w-6 text-blue-500 bg-white rounded-full" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{influencer.name}</h1>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline">
                  <span className="mr-1">⭐</span>
                  {influencer.category}
                </Badge>
                <span className="text-muted-foreground">+1</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-2xl">{influencer.bio}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-1">
                  <span>🇮🇱</span> {influencer.location}
                </span>
                <span className="flex items-center gap-1">
                  <span>🌍</span> {influencer.language}
                </span>
                <span className="text-muted-foreground">{t('influencerDetail.lastUpdated')} {influencer.lastUpdated}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center lg:text-right">
            <div className="mb-4">
              <div className="text-sm text-muted-foreground">{t('influencerSearch.influenceScore')}</div>
              <div className="text-4xl font-bold text-blue-600">{influencer.influenceScore}</div>
              <div className="text-sm text-muted-foreground">{influencer.totalPoints.toLocaleString()} {t('influencerSearch.pts')}</div>
            </div>
            <div className="flex gap-2 justify-center lg:justify-end">
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                {t('common.edit')}
              </Button>
              <Button size="sm">
                <Mail className="h-4 w-4 mr-1" />
                {t('influencerDetail.sendEmail')}
              </Button>
              <Button size="sm" variant="outline">
                <Users className="h-4 w-4 mr-1" />
                {t('influencerSearch.crm')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-8">
        <Button variant="ghost" className="border-b-2 border-blue-500 text-blue-600 rounded-none">
          {t('influencerDetail.socialCoverage')}
        </Button>
        <Button variant="ghost" className="text-muted-foreground rounded-none">{t('influencerDetail.posts')}</Button>
        <Button variant="ghost" className="text-muted-foreground rounded-none">{t('influencerDetail.creatorNetwork')}</Button>
        <Button variant="ghost" className="text-muted-foreground rounded-none">{t('influencerDetail.audience')}</Button>
        <Button variant="ghost" className="text-muted-foreground rounded-none">{t('influencerDetail.scoring')}</Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>{t('influencerDetail.about')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {influencer.quote && (
                <blockquote className="text-center italic p-6 bg-muted rounded-lg border-l-4 border-blue-500">
                  "{influencer.quote}"
                </blockquote>
              )}
              
              <div>
                <h4 className="font-semibold mb-4">{t('influencerDetail.followers')}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-2xl">
                      {getPlatformIcon(primarySocial.platform)}
                    </div>
                    <div>
                      <div className="text-lg font-bold">{(primarySocial.followers / 1000).toFixed(1)}K</div>
                      <div className="text-sm text-muted-foreground">{primarySocial.score}/100</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">{t('influencerDetail.profileOverview')}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {influencer.profileOverview}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">{t('influencerDetail.industries')}</h4>
                <div className="flex flex-wrap gap-2">
                  {influencer.industries.map((industry) => (
                    <Badge key={industry} variant="secondary">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Campaign Ripeness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {t('influencerDetail.campaignRipeness')}
                <span className="text-green-600 font-bold text-xl">
                  {influencer.campaignRipeness.priceRange.split(' ')[0]}
                </span>
                <span className="text-muted-foreground">{t('influencerDetail.perPost')}</span>
                <Badge variant="secondary" className="text-xs">{t('influencerDetail.estimated')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="font-medium">{t('influencerDetail.audienceTarget')}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {influencer.campaignRipeness.audienceTarget}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  <span className="font-medium">{t('influencerDetail.engagement')}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {influencer.campaignRipeness.engagementDescription}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className="font-medium">{t('influencerDetail.brandSuitability')}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {influencer.campaignRipeness.brandSuitability}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="font-medium">{t('influencerDetail.partnershipLikelihood')}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {influencer.campaignRipeness.partnershipLikelihood}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Style */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t('influencerDetail.contentStyle')}
                <span className="text-sm font-normal text-muted-foreground">
                  {influencer.contentStyle.type}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('influencerDetail.brandSafety')}</span>
                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${getBrandSafetyColor(influencer.contentStyle.brandSafety)}`}>
                      {influencer.contentStyle.brandSafety}
                    </span>
                    <div className="w-32 h-3 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: '90%' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('influencerDetail.engagement')}</span>
                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${getEngagementColor(influencer.contentStyle.engagement)}`}>
                      {influencer.contentStyle.engagement}
                    </span>
                    <div className="w-32 h-3 bg-gray-200 rounded-full">
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
  );
};

export default InfluencerDetailPage;
