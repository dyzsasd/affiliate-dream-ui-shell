
import { DomainProfile, DomainOrganization } from '@/generated-api/src/models';
import { UserProfile } from '../authTypes';

export const mapBackendProfileToUserProfile = (backendProfile: DomainProfile): UserProfile => {
  console.log("Mapping backend profile:", backendProfile);
  
  return {
    id: backendProfile.id || '',
    email: backendProfile.email || '',
    first_name: backendProfile.firstName || '',
    last_name: backendProfile.lastName || '',
    role: {
      id: backendProfile.roleId || 0,
      name: backendProfile.roleName || 'User'
    },
    organization: {
      id: backendProfile.organizationId || 0,
      name: 'Loading...' // Will be updated when organization is fetched
    }
  };
};

export const createFallbackProfile = (userMetadata: any): UserProfile => {
  return {
    id: userMetadata.sub || '',
    email: userMetadata.email || '',
    first_name: userMetadata.first_name || '',
    last_name: userMetadata.last_name || '',
    role: {
      id: 0,
      name: 'User'
    },
    organization: {
      id: 0,
      name: 'No Organization'
    }
  };
};

export const updateProfileWithOrganization = (
  profile: UserProfile | null,
  organizationId: number,
  organizationName: string
): UserProfile | null => {
  if (!profile) return null;
  
  return {
    ...profile,
    organization: {
      id: organizationId,
      name: organizationName
    }
  };
};
