
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
  const [profileInitialized, setProfileInitialized] = useState(false);
  
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
              
              // Reset profile initialization when auth state changes
              setProfileInitialized(false);
              
              // Log token expiry for debugging
              if (session.expires_at) {
                const expiryDate = new Date(session.expires_at * 1000);
                console.log('Token expires at:', expiryDate.toISOString());
              }
            } else {
              auth.setSession(null);
              auth.setUser(null);
              setProfileInitialized(false);
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

  // Simplified profile initialization effect with proper guards
  useEffect(() => {
    // Early return if conditions aren't met
    if (!authInitialized || !auth.user || isProfileLoading || profileInitialized) {
      return;
    }
    
    console.log("Starting profile initialization...");
    setProfileInitialized(true);
    
    const loadProfileData = async () => {
      try {
        console.log("Loading profile and organization data...");
        
        // First try to fetch the profile
        const backendProfile = await fetchBackendProfile();
        console.log("Backend profile fetch result:", backendProfile);
        
        // Then, if we have an organizationId, fetch the organization
        if (backendProfile?.organizationId) {
          console.log("Organization ID found:", backendProfile.organizationId);
          try {
            const orgData = await fetchOrganization(backendProfile.organizationId);
            console.log("Organization fetch completed:", orgData);
          } catch (orgError) {
            console.error("Failed to fetch organization:", orgError);
          }
        } else {
          console.warn("No organization ID found in profile");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    
    loadProfileData();
  }, [auth.user, authInitialized, isProfileLoading, profileInitialized]);
  
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
