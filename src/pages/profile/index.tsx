
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DomainProfile } from '@/generated-api/src/models';
import ProfileHeader from './components/ProfileHeader';
import ProfileContent from './components/ProfileContent';

const Profile: React.FC = () => {
  const { user, profile, isProfileLoading, updateProfile, hasPermission, fetchBackendProfile } = useAuth();
  const [backendProfile, setBackendProfile] = useState<DomainProfile | null>(null);
  const [isBackendLoading, setIsBackendLoading] = useState(false);
  const { t } = useTranslation();

  // Fetch backend profile
  useEffect(() => {
    const getBackendProfile = async () => {
      setIsBackendLoading(true);
      try {
        const data = await fetchBackendProfile();
        setBackendProfile(data);
      } catch (error) {
        console.error('Error fetching backend profile:', error);
      } finally {
        setIsBackendLoading(false);
      }
    };

    if (user) {
      getBackendProfile();
    }
  }, [user, fetchBackendProfile]);
  
  if (isProfileLoading || isBackendLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <ProfileHeader />
      <ProfileContent 
        user={user}
        profile={profile} 
        backendProfile={backendProfile}
        updateProfile={updateProfile}
        hasPermission={hasPermission}
      />
    </div>
  );
};

export default Profile;
