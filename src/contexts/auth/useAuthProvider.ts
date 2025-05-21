
import { useState, useEffect } from 'react';
import { Session, User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from './authTypes';

export const useAuthProvider = (mockMode = false) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Mock user for development
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

  useEffect(() => {
    const initAuth = async () => {
      if (mockMode) {
        setSession(mockSession);
        setUser(mockUser);
        setProfile(mockProfile);
        setIsLoading(false);
        return;
      }

      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (newSession) {
            const currentUser = newSession.user as User;
            setSession({
              user: currentUser,
              access_token: newSession.access_token,
            });
            setUser(currentUser);
            
            // Extract profile data from user metadata
            if (currentUser.user_metadata) {
              setProfile({
                first_name: currentUser.user_metadata.first_name,
                last_name: currentUser.user_metadata.last_name,
                role: { name: 'User' }, // Default role
                organization: { name: 'Default Organization' } // Default organization
              });
            }
          } else {
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        });

        // Then check for existing session
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const currentUser = data.session.user as User;
          setSession({
            user: currentUser,
            access_token: data.session.access_token,
          });
          setUser(currentUser);
          
          // Extract profile data from user metadata
          if (currentUser.user_metadata) {
            setProfile({
              first_name: currentUser.user_metadata.first_name,
              last_name: currentUser.user_metadata.last_name,
              role: { name: 'User' }, // Default role
              organization: { name: 'Default Organization' } // Default organization
            });
          }
        }

        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };

    initAuth();
  }, [mockMode]);

  const updateProfile = async (data: { first_name?: string; last_name?: string }) => {
    setIsProfileLoading(true);
    
    try {
      if (mockMode) {
        // Mock update
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
        return;
      }

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        }
      });

      if (error) {
        throw error;
      }

      // Update local state
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

  // Simple permission check (mock implementation)
  const hasPermission = (permission: string) => {
    if (mockMode) {
      return true; // All permissions granted in mock mode
    }
    
    // In a real app, you might check against a list of permissions
    // For now, just check if the user has a role that might have this permission
    return user !== null && (
      permission === 'manage_users' && profile?.role?.name === 'Admin'
    );
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      if (mockMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setSession(mockSession);
        setUser(mockUser);
        setProfile(mockProfile);
        toast({
          title: "Signed in successfully",
          description: "Welcome back, Demo User!",
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        setSession({
          user: data.session.user as User,
          access_token: data.session.access_token,
        });
        
        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${data.session.user?.user_metadata?.first_name || 'User'}!`,
        });
      }
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
      if (mockMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setSession(mockSession);
        setUser(mockUser);
        setProfile(mockProfile);
        toast({
          title: "Account created successfully",
          description: "Welcome to the platform!",
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName,
            last_name: credentials.lastName,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account created successfully",
        description: "Please check your email for verification instructions.",
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
      if (mockMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setSession(null);
        setUser(null);
        setProfile(null);
        toast({
          title: "Signed out successfully",
        });
        return;
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

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
    signIn,
    signUp,
    signOut,
  };
};
