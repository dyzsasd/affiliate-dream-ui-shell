
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Session, User } from '@/types/auth';
import { UserProfile } from '../authTypes';

// Mock data for development purposes
const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  created_at: '2023-01-01T00:00:00Z',
  user_metadata: {
    first_name: 'Demo',
    last_name: 'User',
  },
};

const mockSession: Session = {
  user: mockUser,
  access_token: 'mock-access-token',
};

const mockProfile: UserProfile = {
  first_name: 'Demo',
  last_name: 'User',
  role: { name: 'Admin' },
  organization: { name: 'Demo Organization' }
};

export const useMockAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchBackendProfile = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: 'mock-id',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      roleId: 1,
      organizationId: 1
    };
  };

  const updateProfile = async (data: { first_name?: string; last_name?: string }) => {
    setIsProfileLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfile(prev => ({
        ...prev!,
        first_name: data.first_name || prev?.first_name,
        last_name: data.last_name || prev?.last_name
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

  const hasPermission = () => true; // All permissions granted in mock mode

  const signIn = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSession(mockSession);
      setUser(mockUser);
      setProfile(mockProfile);
      toast({
        title: "Signed in successfully",
        description: "Welcome back, Demo User!",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const signUp = async (credentials: { email: string; password: string; firstName?: string; lastName?: string }) => {
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSession(mockSession);
      setUser(mockUser);
      setProfile(mockProfile);
      toast({
        title: "Account created successfully",
        description: "Welcome to the platform!",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSession(null);
      setUser(null);
      setProfile(null);
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return {
    session,
    user,
    profile,
    isLoading,
    isProfileLoading,
    isSubmitting,
    isAuthenticated: !!session?.user,
    updateProfile,
    hasPermission,
    fetchBackendProfile,
    signIn,
    signUp,
    signOut,
  };
};
