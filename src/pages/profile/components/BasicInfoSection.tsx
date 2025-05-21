
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { UserProfile } from '@/contexts/auth/authTypes';

interface BasicInfoSectionProps {
  profile: UserProfile | null;
  isEditingProfile: boolean;
  formData: {
    firstName: string;
    lastName: string;
  };
  isSaving: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setIsEditingProfile: (value: boolean) => void;
  backendProfile: any | null;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  profile,
  isEditingProfile,
  formData,
  isSaving,
  handleChange,
  handleSubmit,
  setIsEditingProfile,
  backendProfile
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{t("profile.basicInfo")}</h3>
      {isEditingProfile ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                {t("auth.firstName")}
              </label>
              <Input
                id="firstName"
                name="firstName" 
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                {t("auth.lastName")}
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("profile.saving")}
                </>
              ) : (
                t("profile.saveChanges")
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditingProfile(false)}
              disabled={isSaving}
            >
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-sm font-medium text-muted-foreground">{t("auth.firstName")}</dt>
            <dd className="text-sm">{profile?.first_name || backendProfile?.firstName || '-'}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">{t("auth.lastName")}</dt>
            <dd className="text-sm">{profile?.last_name || backendProfile?.lastName || '-'}</dd>
          </dl>
          
          <Button type="button" onClick={() => setIsEditingProfile(true)}>
            {t("profile.editProfile")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BasicInfoSection;
