
import { useState, useEffect } from 'react';
import { useAuthentication } from './hooks/useAuthentication';
import { useProfile } from './hooks/useProfile';
import { useMockAuth } from './hooks/useMockAuth';
import { Session, User } from '@/types/auth';
import { AuthContextType } from './authTypes';

export const useAuthProvider = (mockMode = false): AuthContextType => {
  // Use mock authentication in development if mockMode is enabled
  if (mockMode) {
    return useMockAuth();
  }

  // Use real authentication with Supabase
  const auth = useAuthentication();
  const { profile, isProfileLoading, updateProfile, fetchBackendProfile, hasPermission } = useProfile(auth.user);

  useEffect(() => {
    if (auth.user && !profile) {
      // If there's a user but no profile, try to fetch profile information
      // This ensures we have profile data as soon as a user is authenticated
      updateProfile({
        first_name: auth.user.user_metadata?.first_name,
        last_name: auth.user.user_metadata?.last_name
      }).catch(error => {
        console.error('Failed to initialize profile:', error);
      });
    }
  }, [auth.user, profile]);
  
  return {
    ...auth,
    profile,
    isProfileLoading,
    updateProfile,
    fetchBackendProfile,
    hasPermission
  };
};
