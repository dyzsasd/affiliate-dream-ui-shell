
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
  const { 
    profile, 
    organization, 
    isProfileLoading, 
    isOrganizationLoading, 
    updateProfile, 
    fetchBackendProfile, 
    fetchOrganization, 
    hasPermission 
  } = useProfile(auth.user);
  
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Simplified initialization - only handle auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        
        // Set up auth state listener
        const { data: { subscription } } = auth.supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth state changed:", event, !!session);
            
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
          }
        );

        // Check for existing session
        const { data } = await auth.supabase.auth.getSession();
        if (data?.session) {
          console.log("Existing session found");
          auth.setSession({
            user: data.session.user as User,
            access_token: data.session.access_token,
          });
          auth.setUser(data.session.user as User);
        }
        
        auth.setIsLoading(false);
        setAuthInitialized(true);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        auth.setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, []);
  
  return {
    ...auth,
    profile,
    organization,
    isProfileLoading,
    isOrganizationLoading,
    updateProfile,
    fetchBackendProfile,
    fetchOrganization,
    hasPermission
  };
};
