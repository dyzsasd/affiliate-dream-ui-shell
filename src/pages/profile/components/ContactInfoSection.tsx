
import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '@/types/auth';
import { DomainProfile } from '@/generated-api/src/models';

interface ContactInfoSectionProps {
  user: User | null;
  backendProfile: DomainProfile | null;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ 
  user, 
  backendProfile 
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{t("profile.contactInfo")}</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        <dt className="text-sm font-medium text-muted-foreground">{t("auth.email")}</dt>
        <dd className="text-sm">{user?.email || backendProfile?.email || '-'}</dd>
      </dl>
    </div>
  );
};

export default ContactInfoSection;
