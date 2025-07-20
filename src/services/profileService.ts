
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { UserProfile } from '@/contexts/auth/authTypes';
import { ProfileApi } from '@/generated-api/src/apis/ProfileApi';
import { OrganizationsApi } from '@/generated-api/src/apis/OrganizationsApi';
import { createApiClient, handleApiError, tokenManager } from '@/services/backendApi';
import { HandlersUpdateProfileRequest } from '@/generated-api/src/models';
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
    console.log("Fetching backend profile with authenticated session...");
    const profileApi = await createApiClient(ProfileApi);
    console.log("ProfileApi client created successfully");
    
    const response = await profileApi.usersMeGet();
    console.log("Backend profile fetched successfully:", response);
    
    return response as DomainProfile;
  } catch (error) {
    console.error('Error fetching backend profile:', error);
    console.log('Will attempt to continue with fallback profile data');
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
      const profileApi = await createApiClient(ProfileApi);
      
      const profileRequest: HandlersUpdateProfileRequest = {
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
