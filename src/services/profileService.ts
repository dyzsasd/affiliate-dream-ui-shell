import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { UserProfile } from '@/contexts/auth/authTypes';
import { ProfileApi } from '@/generated-api/src/apis/ProfileApi';
import { OrganizationsApi } from '@/generated-api/src/apis/OrganizationsApi';
import { createApiClient, handleApiError, getAuthTokens } from '@/services/backendApi';
import { HandlersProfileRequest } from '@/generated-api/src/models';
import { DomainProfile, DomainOrganization } from '@/generated-api/src/models';

/**
 * Fetches the user profile from the backend API
 */
export const fetchBackendProfile = async (user: User): Promise<DomainProfile | null> => {
  if (!user) {
    console.log("Cannot fetch profile: No user is logged in");
    return null;
  }
  
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
    
    return response;
  } catch (error) {
    console.error('Error fetching backend profile:', error);
    return null;
  }
};

/**
 * Fetches organization details from the backend API
 */
export const fetchOrganization = async (organizationId: number): Promise<DomainOrganization | null> => {
  if (!organizationId) {
    console.log("Cannot fetch organization: No organization ID provided");
    return null;
  }
  
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
    return org;
  } catch (error) {
    console.error('Error fetching organization:', error);
    return null;
  }
};

/**
 * Updates the user profile in both Supabase auth and backend API
 */
export const updateUserProfile = async (
  user: User, 
  data: { first_name?: string; last_name?: string },
  currentProfile: UserProfile | null
): Promise<void> => {
  try {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
      }
    });

    if (authError) {
      throw authError;
    }

    try {
      const session = await getAuthTokens();
      
      if (!session) {
        throw new Error("No valid session for profile update");
      }
      
      console.log("Session for profile update:", {
        hasAccessToken: !!session.access_token,
        tokenExpiry: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'unknown'
      });
      
      const profileApi = await createApiClient(ProfileApi);
      
      const profileRequest: HandlersProfileRequest = {
        firstName: data.first_name,
        lastName: data.last_name
      };

      await profileApi.profilesIdPut({
        id: user.id,
        profile: profileRequest
      });
    } catch (backendError) {
      console.error('Error updating backend profile:', backendError);
    }
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

/**
 * Simple permission check based on user role
 */
export const checkPermission = (
  user: User | null, 
  profile: UserProfile | null, 
  permission: string
): boolean => {
  return user !== null && (
    permission === 'manage_users' && profile?.role?.name === 'Admin'
  );
};
