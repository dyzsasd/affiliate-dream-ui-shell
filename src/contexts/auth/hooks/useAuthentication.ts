
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Session, User } from '@/types/auth';

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
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setSession(null);
      setUser(null);
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
    setSession,
    user,
    setUser,
    isLoading,
    setIsLoading,
    isSubmitting,
    isAuthenticated: !!session?.user,
    signIn,
    signUp,
    signOut
  };
};
