
import { UserProfile } from '@/contexts/auth/authTypes';
import { DomainProfile } from '@/generated-api/src/models';

/**
 * Maps backend profile data to the frontend UserProfile format
 */
export const mapBackendProfileToUserProfile = (
  backendProfile: DomainProfile | null
): UserProfile | null => {
  if (!backendProfile) return null;
  
  return {
    first_name: backendProfile.firstName || '',
    last_name: backendProfile.lastName || '',
    role: {
      name: String(backendProfile.roleId || 'User')
    },
    organization: {
      id: backendProfile.organizationId || undefined,
      name: '' // Organization name will be populated separately
    }
  };
};

/**
 * Creates a fallback profile from user metadata
 */
export const createFallbackProfile = (
  userMetadata: Record<string, any> | undefined
): UserProfile | null => {
  if (!userMetadata) return null;
  
  return {
    first_name: userMetadata.first_name || '',
    last_name: userMetadata.last_name || '',
    role: {
      name: 'User'
    },
    organization: {
      name: ''
    }
  };
};

/**
 * Updates organization information in a profile
 */
export const updateProfileWithOrganization = (
  profile: UserProfile | null,
  organizationId: number,
  organizationName: string | undefined
): UserProfile | null => {
  if (!profile) return null;
  
  return {
    ...profile,
    organization: {
      ...profile.organization,
      id: organizationId,
      name: organizationName || ''
    }
  };
};
