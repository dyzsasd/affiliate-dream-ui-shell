
import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from '@/contexts/auth/authTypes';
import { User } from '@/types/auth';
import { DomainProfile } from '@/generated-api/src/models';
import BasicInfoSection from './BasicInfoSection';
import ContactInfoSection from './ContactInfoSection';
import OrganizationInfoSection from './OrganizationInfoSection';
import BackendProfileData from './BackendProfileData';
import AdminSection from './AdminSection';

interface ProfileContentProps {
  user: User | null;
  profile: UserProfile | null;
  backendProfile: DomainProfile | null;
  updateProfile: (data: { first_name?: string; last_name?: string }) => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  user,
  profile,
  backendProfile,
  updateProfile,
  hasPermission
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Manage your account settings and profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic info */}
          <BasicInfoSection
            profile={profile}
            isEditingProfile={isEditingProfile}
            formData={formData}
            isSaving={isSaving}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setIsEditingProfile={setIsEditingProfile}
            backendProfile={backendProfile}
          />
          
          <Separator />
          
          {/* Contact info */}
          <ContactInfoSection user={user} backendProfile={backendProfile} />
          
          <Separator />
          
          {/* Organization info */}
          <OrganizationInfoSection profile={profile} backendProfile={backendProfile} />

          {/* Backend Profile Data */}
          {backendProfile && (
            <>
              <Separator />
              <BackendProfileData backendProfile={backendProfile} />
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Admin Section */}
      <AdminSection hasPermission={hasPermission} />
    </div>
  );
};

export default ProfileContent;
