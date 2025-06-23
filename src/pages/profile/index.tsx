
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProfileHeader from './components/ProfileHeader';
import ProfileContent from './components/ProfileContent';

const Profile: React.FC = () => {
  const { 
    user, 
    profile, 
    organization,
    isProfileLoading, 
    isOrganizationLoading,
    updateProfile, 
    hasPermission
  } = useAuth();
  const { t } = useTranslation();

  console.log("Profile page render:", { user: !!user, profile: !!profile, isProfileLoading });
  
  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <ProfileHeader />
      <ProfileContent 
        user={user}
        profile={profile} 
        backendProfile={null}
        organization={organization}
        isOrganizationLoading={isOrganizationLoading}
        updateProfile={updateProfile}
        hasPermission={hasPermission}
      />
    </div>
  );
};

export default Profile;
