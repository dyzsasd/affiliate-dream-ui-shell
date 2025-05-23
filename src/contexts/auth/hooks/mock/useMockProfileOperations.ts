
import { User } from '@/types/auth';
import { UserProfile } from '../../authTypes';
import { DomainProfile, DomainOrganization } from '@/generated-api/src/models';

/**
 * Profile operations for mock user
 */
export const useMockProfileOperations = (
  user: User | null,
  profile: UserProfile | null,
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setOrganization: React.Dispatch<React.SetStateAction<DomainOrganization | null>>,
  setIsProfileLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsOrganizationLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Mock profile update
  const updateProfile = async (data: { first_name?: string; last_name?: string }) => {
    setIsProfileLoading(true);
    try {
      // Update local state
      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          first_name: data.first_name || prev.first_name,
          last_name: data.last_name || prev.last_name,
        };
      });

      // Update user metadata if it exists
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            first_name: data.first_name || user.user_metadata?.first_name,
            last_name: data.last_name || user.user_metadata?.last_name,
          },
        });
      }

      console.log('Mock auth: Profile updated successfully', data);
    } catch (error) {
      console.error('Mock auth: Profile update error', error);
      throw error;
    } finally {
      setIsProfileLoading(false);
    }
  };
  
  // Mock fetch backend profile
  const fetchBackendProfile = async () => {
    setIsProfileLoading(true);
    try {
      // Create a mock backend profile
      const mockBackendProfile: DomainProfile = {
        id: 'mock-user-id',
        email: user?.email || 'mock@example.com',
        firstName: profile?.first_name || 'Mock',
        lastName: profile?.last_name || 'User',
        roleId: 1,
        organizationId: 123,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('Mock auth: Fetched backend profile successfully', mockBackendProfile);
      return mockBackendProfile;
    } catch (error) {
      console.error('Mock auth: Fetch backend profile error', error);
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  };
  
  // Mock fetch organization
  const fetchOrganization = async (organizationId: number) => {
    setIsOrganizationLoading(true);
    try {
      // Create a mock organization
      const mockOrganization: DomainOrganization = {
        organizationId: organizationId,
        name: `Mock Organization ${organizationId}`,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update the organization state
      setOrganization(mockOrganization);
      
      console.log('Mock auth: Fetched organization successfully', mockOrganization);
      return mockOrganization;
    } catch (error) {
      console.error('Mock auth: Fetch organization error', error);
      return null;
    } finally {
      setIsOrganizationLoading(false);
    }
  };
  
  // Mock permission check
  const hasPermission = (permission: string) => {
    // For mock auth, we assume admin has all permissions
    return profile?.role?.name === 'Admin';
  };

  return {
    updateProfile,
    fetchBackendProfile,
    fetchOrganization,
    hasPermission
  };
};
