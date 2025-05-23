
import { useState } from 'react';
import { Session, User } from '@/types/auth';
import { UserProfile, AuthContextType } from '../authTypes';
import { DomainProfile, DomainOrganization } from '@/generated-api/src/models';

/**
 * Mock authentication hooks for development
 * This simulates authentication behavior without actually connecting to Supabase
 */
export const useMockAuth = (): AuthContextType => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<DomainOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isOrganizationLoading, setIsOrganizationLoading] = useState(false);

  const isAuthenticated = !!session;

  // Mock sign in
  const signIn = async (credentials: { email: string; password: string }) => {
    setIsSubmitting(true);
    try {
      // Simulate a successful mock login
      const mockUser: User = {
        id: 'mock-user-id',
        email: credentials.email,
        created_at: new Date().toISOString(),
        user_metadata: {
          first_name: 'Mock',
          last_name: 'User'
        }
      };

      const mockSession: Session = {
        user: mockUser,
        access_token: 'mock-access-token',
      };

      // Set states
      setUser(mockUser);
      setSession(mockSession);

      // Set up a mock profile
      setProfile({
        first_name: 'Mock',
        last_name: 'User',
        role: {
          name: 'Admin'
        },
        organization: {
          id: 123,
          name: 'Mock Organization'
        }
      });
      
      // Set up a mock organization
      setOrganization({
        organizationId: 123,
        name: 'Mock Organization',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('Mock auth: Signed in successfully', { mockUser, mockSession });
    } catch (error) {
      console.error('Mock auth: Sign in error', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock sign up
  const signUp = async (credentials: { email: string; password: string; firstName?: string; lastName?: string }) => {
    setIsSubmitting(true);
    try {
      // Create a mock user based on provided details
      const mockUser: User = {
        id: 'mock-user-id',
        email: credentials.email,
        created_at: new Date().toISOString(),
        user_metadata: {
          first_name: credentials.firstName || 'New',
          last_name: credentials.lastName || 'User'
        }
      };

      const mockSession: Session = {
        user: mockUser,
        access_token: 'mock-access-token',
      };

      // Set auth states
      setUser(mockUser);
      setSession(mockSession);

      // Set up default profile
      setProfile({
        first_name: credentials.firstName || 'New',
        last_name: credentials.lastName || 'User',
        role: {
          name: 'User'
        },
        organization: {
          id: 123,
          name: 'Mock Organization'
        }
      });
      
      // Set up a mock organization
      setOrganization({
        organizationId: 123,
        name: 'Mock Organization',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Mock auth: Signed up successfully', { mockUser });
    } catch (error) {
      console.error('Mock auth: Sign up error', error);
      throw new Error('Could not create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock sign out
  const signOut = async () => {
    try {
      setUser(null);
      setSession(null);
      setProfile(null);
      setOrganization(null);
      console.log('Mock auth: Signed out successfully');
    } catch (error) {
      console.error('Mock auth: Sign out error', error);
      throw error;
    }
  };

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
    session,
    user,
    profile,
    organization,
    isLoading,
    isSubmitting,
    isProfileLoading,
    isOrganizationLoading,
    isAuthenticated,
    updateProfile,
    hasPermission,
    fetchBackendProfile,
    fetchOrganization,
    signIn,
    signUp,
    signOut
  };
};
