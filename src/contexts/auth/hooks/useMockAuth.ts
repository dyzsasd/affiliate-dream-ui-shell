
import { AuthContextType } from '../authTypes';
import { useMockUserState } from './mock/useMockUserState';
import { useMockAuthOperations } from './mock/useMockAuthOperations';
import { useMockProfileOperations } from './mock/useMockProfileOperations';

/**
 * Mock authentication hooks for development
 * This simulates authentication behavior without actually connecting to Supabase
 */
export const useMockAuth = (): AuthContextType => {
  // Get state handlers from user state hook
  const {
    session,
    setSession,
    user,
    setUser,
    profile,
    setProfile,
    organization,
    setOrganization,
    isLoading,
    isSubmitting,
    setIsSubmitting,
    isProfileLoading,
    setIsProfileLoading,
    isOrganizationLoading,
    setIsOrganizationLoading,
    isAuthenticated
  } = useMockUserState();

  // Get auth operations
  const { signIn, signUp, signOut, forgotPassword, resetPassword } = useMockAuthOperations(
    setUser,
    setSession,
    setProfile,
    setOrganization,
    setIsSubmitting
  );

  // Get profile operations
  const { 
    updateProfile, 
    fetchBackendProfile, 
    fetchOrganization, 
    hasPermission 
  } = useMockProfileOperations(
    user,
    profile,
    setProfile,
    setUser,
    setOrganization,
    setIsProfileLoading,
    setIsOrganizationLoading
  );

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
    signOut,
    forgotPassword,
    resetPassword
  };
};
