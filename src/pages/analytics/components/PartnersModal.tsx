
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface Partner {
  id: number;
  name: string;
  type: string;
  joinDate: string;
  performance: 'high' | 'medium' | 'low';
}

interface PartnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  partners: Partner[];
  advertiserName: string;
}

const PartnersModal: React.FC<PartnersModalProps> = ({ 
  isOpen, 
  onClose, 
  partners, 
  advertiserName 
}) => {
  const { t } = useTranslation();

  const getPerformanceBadgeColor = (performance: string) => {
    switch (performance) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      student: 'bg-red-100 text-red-800',
      blog: 'bg-orange-100 text-orange-800',
      incentive: 'bg-yellow-100 text-yellow-800',
      content: 'bg-purple-100 text-purple-800',
      forum: 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t('analytics.partnersFor')} {advertiserName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Showing top {Math.min(partners.length, 10)} partners
          </div>
          
          <div className="grid gap-4">
            {partners.slice(0, 10).map((partner) => (
              <div 
                key={partner.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Joined: {new Date(partner.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getTypeColor(partner.type)}>
                      {partner.type}
                    </Badge>
                    <Badge className={getPerformanceBadgeColor(partner.performance)}>
                      {partner.performance} performance
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartnersModal;
