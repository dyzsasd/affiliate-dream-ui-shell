
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types/auth';
import { UserProfile } from '../authTypes';
import { ProfileApi } from '@/generated-api/src/apis/ProfileApi';
import { OrganizationsApi } from '@/generated-api/src/apis/OrganizationsApi';
import { createApiClient, handleApiError, getAuthTokens } from '@/services/backendApi';
import { HandlersProfileRequest, HandlersUpsertProfileRequest } from '@/generated-api/src/models';
import { DomainOrganization } from '@/generated-api/src/models';

export const useProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<DomainOrganization | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isOrganizationLoading, setIsOrganizationLoading] = useState(false);
  const [backendFetchAttempted, setBackendFetchAttempted] = useState(false);
  const { toast } = useToast();

  const fetchBackendProfile = async () => {
    if (!user) {
      console.log("Cannot fetch profile: No user is logged in");
      return null;
    }
    
    // Prevent multiple fetch attempts if the backend is not available
    if (backendFetchAttempted) {
      console.log("Already attempted to fetch backend profile, using local data");
      return null;
    }
    
    setIsProfileLoading(true);
    setBackendFetchAttempted(true);
    
    try {
      // Get a fresh session with possibly refreshed token
      const session = await getAuthTokens();
      
      if (!session) {
        console.log("No valid session found for profile fetch");
        throw new Error("Authentication required");
      }
      
      console.log("Session for profile fetch:", {
        userId: session.user?.id,
        hasAccessToken: !!session.access_token,
        tokenExpiry: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'unknown'
      });
      
      console.log("Fetching backend profile with authenticated session...");
      const profileApi = await createApiClient(ProfileApi);
      console.log("ProfileApi client created successfully");
      
      const response = await profileApi.usersMeGet();
      console.log("Backend profile fetched successfully:", response);
      
      // Update local profile state with fetched data
      if (response) {
        setProfile({
          first_name: response.firstName || '',
          last_name: response.lastName || '',
          role: {
            name: String(response.roleId || 'User')
          },
          organization: {
            id: response.organizationId || undefined,
            name: '' // Will be populated by fetchOrganization
          }
        });
        
        // If we have an organization ID, fetch the organization details
        if (response.organizationId) {
          await fetchOrganization(response.organizationId);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching backend profile:', error);
      
      // Initialize profile from user metadata as fallback
      if (user?.user_metadata) {
        setProfile({
          first_name: user.user_metadata.first_name || '',
          last_name: user.user_metadata.last_name || '',
          role: {
            name: 'User'
          },
          organization: {
            name: ''
          }
        });
      }
      
      toast({
        title: "Using local profile data",
        description: "Could not connect to backend server. Using local profile data instead.",
        variant: "default",
      });
      
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  };

  const fetchOrganization = async (organizationId: number) => {
    if (!organizationId) {
      console.log("Cannot fetch organization: No organization ID provided");
      return null;
    }

    setIsOrganizationLoading(true);
    
    try {
      // Get a fresh session with possibly refreshed token
      const session = await getAuthTokens();
      
      if (!session) {
        console.log("No valid session found for organization fetch");
        throw new Error("Authentication required");
      }
      
      console.log("Fetching organization data for ID:", organizationId);
      const organizationsApi = await createApiClient(OrganizationsApi);
      
      const org = await organizationsApi.organizationsIdGet({
        id: organizationId
      });
      
      console.log("Organization fetched successfully:", org);
      
      // Update organization state
      setOrganization(org);
      
      // Update the organization name in the profile
      setProfile(prevProfile => {
        if (!prevProfile) return null;
        
        return {
          ...prevProfile,
          organization: {
            ...prevProfile.organization,
            id: organizationId,
            name: org.name || ''
          }
        };
      });
      
      return org;
    } catch (error) {
      console.error('Error fetching organization:', error);
      toast({
        title: "Organization data unavailable",
        description: "Could not fetch organization details from the server.",
        variant: "default",
      });
      return null;
    } finally {
      setIsOrganizationLoading(false);
    }
  };

  const updateProfile = async (data: { first_name?: string; last_name?: string }) => {
    setIsProfileLoading(true);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Step 1: Update user metadata in Supabase Auth (keep this part for authentication)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        }
      });

      if (authError) {
        throw authError;
      }

      // Step 2: Update profile in backend service using upsert method
      try {
        // Get a fresh session with possibly refreshed token
        const session = await getAuthTokens();
        
        if (!session) {
          throw new Error("No valid session for profile update");
        }
        
        console.log("Session for profile update:", {
          hasAccessToken: !!session.access_token,
          tokenExpiry: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'unknown'
        });
        
        const profileApi = await createApiClient(ProfileApi);
        
        // Create profile upsert request
        const profileRequest: HandlersUpsertProfileRequest = {
          id: user.id,
          email: user.email,
          firstName: data.first_name,
          lastName: data.last_name,
          organizationId: profile?.organization?.id
        };

        // Use upsertPost method instead of profilesIdPut
        await profileApi.profilesUpsertPost({
          profile: profileRequest
        });
        
        // After successful update, fetch the latest profile
        await fetchBackendProfile();
      } catch (backendError) {
        console.error('Error updating backend profile:', backendError);
        // Continue with the local update even if the backend update fails
      }

      // Update local state
      setProfile(prev => prev && ({
        ...prev,
        first_name: data.first_name || prev.first_name,
        last_name: data.last_name || prev.last_name
      }));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProfileLoading(false);
    }
  };

  const hasPermission = (permission: string) => {
    // Simple permission check based on profile roles
    // In a real app, you might check against a list of permissions from the backend
    return user !== null && (
      permission === 'manage_users' && profile?.role?.name === 'Admin'
    );
  };

  return {
    profile,
    setProfile,
    organization,
    isProfileLoading,
    isOrganizationLoading,
    fetchBackendProfile,
    fetchOrganization,
    updateProfile,
    hasPermission
  };
};
