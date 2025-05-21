
import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfileHeader: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>
  );
};

export default ProfileHeader;
