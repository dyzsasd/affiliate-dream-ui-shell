
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
  const [profileFetchAttempted, setProfileFetchAttempted] = useState(false);
  
  // Add initialization effect
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        // First set up the auth state listener to ensure we don't miss events
        const { data: { subscription } } = auth.supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth state changed:", event);
            console.log("Session present:", !!session);
            
            if (session) {
              // Store the complete session object with tokens
              auth.setSession({
                user: session.user as User,
                access_token: session.access_token,
              });
              auth.setUser(session.user as User);
              
              // Log token expiry for debugging
              if (session.expires_at) {
                const expiryDate = new Date(session.expires_at * 1000);
                console.log('Token expires at:', expiryDate.toISOString());
              }
            } else {
              auth.setSession(null);
              auth.setUser(null);
            }
          }
        );

        // Then check for existing session
        const { data } = await auth.supabase.auth.getSession();
        if (data?.session) {
          console.log("Existing session found");
          // Save the complete session with tokens
          auth.setSession({
            user: data.session.user as User,
            access_token: data.session.access_token,
          });
          auth.setUser(data.session.user as User);
          
          // Log token expiry for debugging
          if (data.session.expires_at) {
            const expiryDate = new Date(data.session.expires_at * 1000);
            console.log('Token expires at:', expiryDate.toISOString());
          }
        } else {
          console.log("No existing session found");
        }
        
        auth.setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        auth.setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const initializeProfile = async () => {
      if (auth.user && !profile && !profileFetchAttempted && !isProfileLoading) {
        // If there's a user but no profile, try to fetch profile from the backend
        console.log("User exists but no profile, fetching from backend...");
        setProfileFetchAttempted(true);
        
        try {
          await fetchBackendProfile();
        } catch (error) {
          console.error('Failed to fetch backend profile:', error);
          
          // Fallback to initializing profile from user metadata
          if (auth.user?.user_metadata) {
            updateProfile({
              first_name: auth.user.user_metadata.first_name,
              last_name: auth.user.user_metadata.last_name
            }).catch(error => {
              console.error('Failed to initialize profile:', error);
            });
          }
        }
      }
    };
    
    initializeProfile();
  }, [auth.user, profile, profileFetchAttempted, isProfileLoading]);
  
  return {
    ...auth,
    profile,
    isProfileLoading,
    updateProfile,
    fetchBackendProfile,
    hasPermission
  };
};
