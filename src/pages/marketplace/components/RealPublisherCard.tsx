import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ContactPublisherModal from "./ContactPublisherModal";
import AddToFavoritesModal from "./AddToFavoritesModal";
import PublisherWebsitePreview from "./PublisherWebsitePreview";
import PublisherDetails from "./PublisherDetails";
import PublisherVerticalMix from "./PublisherVerticalMix";
import type { DomainAnalyticsPublisherResponse } from '@/generated-api/src/models';

interface RealPublisherCardProps {
  publisher: DomainAnalyticsPublisherResponse;
  viewMode: "grid" | "list";
  onViewDetails: () => void;
  hideContactButton?: boolean;
  listId?: number;
}

const RealPublisherCard: React.FC<RealPublisherCardProps> = ({
  publisher,
  viewMode,
  onViewDetails,
  hideContactButton = false,
  listId
}) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddToFavoritesModal, setShowAddToFavoritesModal] = useState(false);

  const publisherData = publisher.publisher;
  if (!publisherData) return null;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Section - Website Preview */}
          <PublisherWebsitePreview
            publisherData={publisherData}
            onViewDetails={onViewDetails}
            onContact={() => setShowContactModal(true)}
            onAddToFavorites={() => setShowAddToFavoritesModal(true)}
            hideContactButton={hideContactButton}
          />

          {/* Middle Section - Details */}
          <PublisherDetails publisherData={publisherData} />

          {/* Right Section - Vertical Mix */}
          <PublisherVerticalMix publisherData={publisherData} />
        </div>
      </CardContent>
      
      {/* Contact Modal */}
      <ContactPublisherModal
        publisher={publisher}
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        listId={listId}
      />

      {/* Add to Favorites Modal */}
      <AddToFavoritesModal
        publisher={publisher}
        isOpen={showAddToFavoritesModal}
        onClose={() => setShowAddToFavoritesModal(false)}
      />
    </Card>
  );
};

export default RealPublisherCard;