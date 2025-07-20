import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Check, Mail, UserPlus } from 'lucide-react';

interface PublisherStatusProgressProps {
  status?: string;
  className?: string;
}

const getSteps = (t: any) => [
  { key: 'added', label: t('favoritePublishers.statusAdded'), icon: UserPlus },
  { key: 'contacted', label: t('favoritePublishers.statusContacted'), icon: Mail },
  { key: 'accepted', label: t('favoritePublishers.statusAccepted'), icon: Check }
];

const PublisherStatusProgress: React.FC<PublisherStatusProgressProps> = ({
  status,
  className
}) => {
  const { t } = useTranslation();
  const steps = getSteps(t);
  const normalizedStatus = status?.toLowerCase();
  const currentStepIndex = steps.findIndex(step => step.key === normalizedStatus);
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = currentStepIndex >= index;
        const isCurrent = currentStepIndex === index;
        
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  "ml-2 text-xs font-medium",
                  isCompleted
                    ? "text-primary"
                    : isCurrent
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 transition-colors duration-200 ml-2",
                  isCompleted && currentStepIndex > index
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PublisherStatusProgress;