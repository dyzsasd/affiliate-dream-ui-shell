
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  MapPin, 
  Calendar, 
  Globe, 
  Mail, 
  Users, 
  TrendingUp,
  CheckCircle,
  X,
  ExternalLink,
  Youtube,
  Instagram,
  Twitter,
  Facebook
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Publisher } from "../types/publisher";
import PartnershipRequestModal from "./PartnershipRequestModal";

interface PublisherDetailPanelProps {
  publisher: Publisher;
  isOpen: boolean;
  onClose: () => void;
}

const PublisherDetailPanel: React.FC<PublisherDetailPanelProps> = ({
  publisher,
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);

  const handleSendMessage = () => {
    toast({
      title: t("marketplace.messageSent"),
      description: t("marketplace.messagesentDescription", { name: publisher.name }),
    });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={publisher.logo} alt={publisher.name} />
                  <AvatarFallback>{publisher.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    {publisher.name}
                    {publisher.isVerified && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </DialogTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {publisher.country}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {publisher.rating} ({publisher.reviewCount} {t("marketplace.reviews")})
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {t("marketplace.joinedDate")}: {new Date(publisher.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowPartnershipModal(true)}>
                  {t("marketplace.requestPartnership")}
                </Button>
                <Button variant="outline" onClick={handleSendMessage}>
                  <Mail className="h-4 w-4 mr-2" />
                  {t("marketplace.sendMessage")}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">{t("marketplace.overview")}</TabsTrigger>
                <TabsTrigger value="audience">{t("marketplace.audienceTraffic")}</TabsTrigger>
                <TabsTrigger value="performance">{t("marketplace.performance")}</TabsTrigger>
                <TabsTrigger value="contact">{t("marketplace.contact")}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("marketplace.about")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{publisher.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">${publisher.averageEPC}</p>
                        <p className="text-sm text-muted-foreground">{t("marketplace.averageEPC")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{publisher.conversionRate}%</p>
                        <p className="text-sm text-muted-foreground">{t("marketplace.conversionRate")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{(publisher.monthlyTraffic / 1000000).toFixed(1)}M</p>
                        <p className="text-sm text-muted-foreground">{t("marketplace.monthlyTraffic")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{publisher.rating}</p>
                        <p className="text-sm text-muted-foreground">{t("marketplace.rating")}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">{t("marketplace.categories")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {publisher.categories.map((category) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t("marketplace.payoutModels")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {publisher.payoutModels.map((model) => (
                            <Badge key={model} variant="outline">
                              {model}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t("marketplace.tags")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {publisher.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audience" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("marketplace.primaryAudience")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">{t("marketplace.ageRange")}</p>
                          <p className="text-muted-foreground">{publisher.primaryAudience.ageRange}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t("marketplace.gender")}</p>
                          <p className="text-muted-foreground">{publisher.primaryAudience.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t("marketplace.interests")}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {publisher.primaryAudience.interests.map((interest) => (
                              <Badge key={interest} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("marketplace.trafficSources")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {publisher.trafficSources.map((source) => (
                          <div key={source} className="flex items-center justify-between">
                            <span>{source}</span>
                            <Badge variant="secondary">Primary</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("marketplace.topCategories")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {publisher.topCategories.map((cat) => (
                        <div key={cat.category} className="flex items-center justify-between">
                          <span>{cat.category}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${cat.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{cat.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("marketplace.overallPerformance")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{t("marketplace.totalClicks")}</p>
                          <p className="text-2xl font-bold">{publisher.performance.totalClicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t("marketplace.totalConversions")}</p>
                          <p className="text-2xl font-bold">{publisher.performance.totalConversions.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t("marketplace.totalRevenue")}</p>
                          <p className="text-2xl font-bold">${publisher.performance.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t("marketplace.averageOrderValue")}</p>
                          <p className="text-2xl font-bold">${publisher.performance.averageOrderValue}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("marketplace.keyMetrics")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>{t("marketplace.conversionRate")}</span>
                          <span className="font-semibold">{publisher.conversionRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{t("marketplace.averageEPC")}</span>
                          <span className="font-semibold">${publisher.averageEPC}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{t("marketplace.rating")}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{publisher.rating}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("marketplace.contactInformation")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{publisher.contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={publisher.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {publisher.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{t("marketplace.lastActive")}: {new Date(publisher.lastActive).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("marketplace.socialMedia")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(publisher.socialMedia).map(([platform, url]) => (
                          url && (
                            <div key={platform} className="flex items-center gap-3">
                              {getSocialIcon(platform)}
                              <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-1 capitalize"
                              >
                                {platform}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <PartnershipRequestModal
        publisher={publisher}
        isOpen={showPartnershipModal}
        onClose={() => setShowPartnershipModal(false)}
      />
    </>
  );
};

export default PublisherDetailPanel;
