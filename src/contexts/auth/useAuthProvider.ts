
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
  
  // Add initialization effect
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get session from Supabase
        const { data } = await auth.supabase.auth.getSession();
        if (data?.session) {
          auth.setSession({
            user: data.session.user as User,
            access_token: data.session.access_token,
          });
          auth.setUser(data.session.user as User);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        // Important: Always set loading to false even if there's an error
        auth.setIsLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = auth.supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          auth.setSession({
            user: session.user as User,
            access_token: session.access_token,
          });
          auth.setUser(session.user as User);
        } else {
          auth.setSession(null);
          auth.setUser(null);
        }
        auth.setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (auth.user && !profile) {
      // If there's a user but no profile, try to fetch profile from the backend
      console.log("User exists but no profile, fetching from backend...");
      fetchBackendProfile().catch(error => {
        console.error('Failed to fetch backend profile:', error);
        
        // Fallback to initializing profile from user metadata if backend fetch fails
        updateProfile({
          first_name: auth.user.user_metadata?.first_name,
          last_name: auth.user.user_metadata?.last_name
        }).catch(error => {
          console.error('Failed to initialize profile:', error);
        });
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
