import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Profile: React.FC = () => {
  const { user, profile, isProfileLoading, updateProfile, hasPermission } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
  });
  
  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
      });
    }
  }, [profile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.accountInfo")}</CardTitle>
            <CardDescription>
              {t("profile.accountInfoDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic info */}
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
                    <dd className="text-sm">{profile?.first_name || '-'}</dd>
                    
                    <dt className="text-sm font-medium text-muted-foreground">{t("auth.lastName")}</dt>
                    <dd className="text-sm">{profile?.last_name || '-'}</dd>
                  </dl>
                  
                  <Button type="button" onClick={() => setIsEditingProfile(true)}>
                    {t("profile.editProfile")}
                  </Button>
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Contact info */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("profile.contactInfo")}</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <dt className="text-sm font-medium text-muted-foreground">{t("auth.email")}</dt>
                <dd className="text-sm">{user?.email || '-'}</dd>
              </dl>
            </div>
            
            <Separator />
            
            {/* Organization info */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("profile.organizationInfo")}</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <dt className="text-sm font-medium text-muted-foreground">{t("profile.organization")}</dt>
                <dd className="text-sm">{profile?.organization?.name || t("profile.notAssigned")}</dd>
                
                <dt className="text-sm font-medium text-muted-foreground">{t("profile.role")}</dt>
                <dd className="text-sm">{profile?.role?.name || '-'}</dd>
              </dl>
            </div>
          </CardContent>
        </Card>
        
        {/* Display only for admin users */}
        {hasPermission('manage_users') && (
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
        )}
      </div>
    </div>
  );
};

export default Profile;
