
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AdminSectionProps {
  hasPermission: (permission: string) => boolean;
}

const AdminSection: React.FC<AdminSectionProps> = ({ hasPermission }) => {
  const { t } = useTranslation();

  if (!hasPermission('manage_users')) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.adminOptions")}</CardTitle>
        <CardDescription>
          {t("profile.adminOptionsDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{t("profile.adminMessage")}</p>
        <Button variant="secondary">
          {t("profile.manageUsers")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminSection;
