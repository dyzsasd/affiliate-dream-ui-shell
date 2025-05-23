
import React from 'react';
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
import { DomainProfile, DomainOrganization } from '@/generated-api/src/models';
import BasicInfoSection from './BasicInfoSection';
import ContactInfoSection from './ContactInfoSection';
import OrganizationInfoSection from './OrganizationInfoSection';
import BackendProfileData from './BackendProfileData';
import AdminSection from './AdminSection';
import { useProfileForm } from '../hooks/useProfileForm';

interface ProfileContentProps {
  user: User | null;
  profile: UserProfile | null;
  backendProfile: DomainProfile | null;
  organization: DomainOrganization | null;
  isOrganizationLoading: boolean;
  updateProfile: (data: { first_name?: string; last_name?: string }) => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  user,
  profile,
  backendProfile,
  organization,
  isOrganizationLoading,
  updateProfile,
  hasPermission
}) => {
  const {
    isEditingProfile,
    setIsEditingProfile,
    isSaving,
    formData,
    handleChange,
    handleSubmit
  } = useProfileForm({ profile, updateProfile });

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
          <OrganizationInfoSection 
            profile={profile} 
            backendProfile={backendProfile}
            organization={organization}
            isOrganizationLoading={isOrganizationLoading}
          />

          {/* Backend Profile Data */}
          {backendProfile && (
            <>
              <Separator />
              <BackendProfileData 
                backendProfile={backendProfile} 
                organization={organization}
              />
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
