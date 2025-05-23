
import { User, Session } from '@/types/auth';
import { UserProfile } from '../../authTypes';
import { DomainOrganization } from '@/generated-api/src/models';

/**
 * Authentication operations for mock user
 */
export const useMockAuthOperations = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setSession: React.Dispatch<React.SetStateAction<Session | null>>,
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
  setOrganization: React.Dispatch<React.SetStateAction<DomainOrganization | null>>,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

  return {
    signIn,
    signUp,
    signOut
  };
};
