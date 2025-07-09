import React from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type { DomainAnalyticsPublisherResponsePublisher } from '@/generated-api/src/models';

interface PublisherVerticalMixProps {
  publisherData: DomainAnalyticsPublisherResponsePublisher;
}

const PublisherVerticalMix: React.FC<PublisherVerticalMixProps> = ({ publisherData }) => {
  const { t } = useTranslation();

  // Get top verticals
  const topVerticals = publisherData.verticalsV2?.value?.slice(0, 5) || [];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-sm mb-3">Vertical Mix</h4>
        
        {/* Vertical Progress Bar */}
        {topVerticals.length > 0 && (
          <div className="space-y-3">
            <div className="flex h-2 rounded-full overflow-hidden bg-muted">
              {topVerticals.map((vertical: any, index: number) => {
                const colors = [
                  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                  'bg-purple-500', 'bg-pink-500'
                ];
                const width = Math.max(15, (vertical.score || 20) / 2); // Ensure minimum width
                
                return (
                  <div
                    key={index}
                    className={`${colors[index % colors.length]} transition-all duration-300`}
                    style={{ width: `${width}%` }}
                  />
                );
              })}
            </div>
            
            <div className="space-y-1">
              {topVerticals.map((vertical: any, index: number) => {
                const colors = [
                  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
                  'bg-purple-500', 'bg-pink-500'
                ];
                
                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${colors[index % colors.length]}`} />
                    <span className="text-muted-foreground flex-1 truncate">
                      {vertical.name}
                    </span>
                    <span className="font-medium">{vertical.score}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Social Media */}
      {publisherData.socialMedia?.value && (
        <div>
          <h4 className="font-medium text-sm mb-2">{t("marketplace.socialPlatforms")}</h4>
          <div className="flex gap-2">
            {Object.entries(publisherData.socialMedia.value).slice(0, 4).map(([platform, url]) => (
              <Badge 
                key={platform} 
                variant="outline" 
                className="text-xs capitalize cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => url && window.open(url, '_blank')}
              >
                {platform}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublisherVerticalMix;