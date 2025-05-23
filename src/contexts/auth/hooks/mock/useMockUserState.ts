
import { useState } from 'react';
import { Session, User } from '@/types/auth';
import { UserProfile } from '../../authTypes';
import { DomainOrganization } from '@/generated-api/src/models';

/**
 * Hook for managing mock user state
 */
export const useMockUserState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<DomainOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isOrganizationLoading, setIsOrganizationLoading] = useState(false);

  const isAuthenticated = !!session;

  return {
    // State
    session,
    setSession,
    user,
    setUser,
    profile,
    setProfile,
    organization,
    setOrganization,
    isLoading,
    setIsLoading,
    isSubmitting,
    setIsSubmitting,
    isProfileLoading,
    setIsProfileLoading,
    isOrganizationLoading,
    setIsOrganizationLoading,
    isAuthenticated
  };
};
