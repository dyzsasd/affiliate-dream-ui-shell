
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Session, User } from '@/types/auth';
import { ProfileApi } from '@/generated-api/src/apis';
import { createApiClient, handleApiError } from '@/services/backendApi';
import { HandlersUpsertProfileRequest } from '@/generated-api/src/models';

export const useAuthentication = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const signIn = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      console.log("Signing in with credentials...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        console.log("Sign-in successful, saving complete session information");
        console.log("Access token present:", !!data.session.access_token);
        console.log("Refresh token present:", !!data.session.refresh_token);
        
        // Store the full session for token refresh
        setSession({
          user: data.session.user as User,
          access_token: data.session.access_token,
        });
        setUser(data.session.user as User);
        
        // Log token expiration time for debugging
        if (data.session.expires_at) {
          const expiryDate = new Date(data.session.expires_at * 1000);
          console.log('Token expires at:', expiryDate.toISOString());
          
          // Schedule a debug log before expiration
          const timeUntilExpiry = data.session.expires_at * 1000 - Date.now();
          if (timeUntilExpiry > 0) {
            console.log(`Token will expire in ${timeUntilExpiry / 1000} seconds`);
          }
        }
        
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

  const signUp = async (credentials: { 
    email: string; 
    password: string; 
    firstName?: string; 
    lastName?: string; 
    organizationId?: number;
  }) => {
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            organization_id: credentials.organizationId,
          },
        },
      });

      if (error) {
        throw error;
      }

      // If sign-up is successful, make sure to sync the user profile with the backend
      if (data.user) {
        try {
          const profileApi = await createApiClient(ProfileApi);
          
          // Create profile upsert request for backend
          const profileRequest: HandlersUpsertProfileRequest = {
            id: data.user.id,
            email: data.user.email,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            organizationId: credentials.organizationId,
          };

          // Upsert profile in backend - assumes the backend API has this functionality
          await profileApi.profilesUpsertPost({ profile: profileRequest });
          
          console.log('Profile synced with backend successfully');
        } catch (backendError) {
          console.error('Could not sync profile with backend during signup:', backendError);
          // Continue with sign-up even if backend sync fails
        }
      }

      toast({
        title: "Account created successfully",
        description: credentials.organizationId 
          ? "Your account has been created and linked to the organization."
          : "Please check your email for verification instructions.",
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
      const { error } = await supabase.auth.signOut();

      if (error) {
        // If session_not_found, still clear local state since session is invalid
        if (error.message?.includes('session_not_found') || error.message?.includes('Session from session_id claim')) {
          console.log('Session already invalid on server, clearing local state');
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      // Only show error for non-session issues
      if (!error.message?.includes('session_not_found') && !error.message?.includes('Session from session_id claim')) {
        toast({
          title: "Error signing out",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      // Always clear local state and storage, regardless of server response
      localStorage.removeItem('debug_mode_enabled');
      localStorage.removeItem('debug_backend_url');
      
      setSession(null);
      setUser(null);
      setIsLoading(false);
      setIsSubmitting(false);
      
      toast({
        title: "Signed out successfully",
      });
    }
  };

  const forgotPassword = async (email: string) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error sending reset email",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (newPassword: string) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password updated successfully",
        description: "Your password has been changed.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    session,
    setSession,
    user,
    setUser,
    isLoading,
    setIsLoading,
    isSubmitting,
    isAuthenticated: !!session?.user,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    supabase // Expose the supabase client
  };
};
