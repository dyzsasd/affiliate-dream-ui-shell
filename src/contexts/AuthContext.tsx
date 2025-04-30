
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, SignInCredentials, SignUpCredentials, User } from '../types/auth';
import { authService, mockSession } from '../services/supabase';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; mockMode?: boolean }> = ({ 
  children,
  mockMode = true // Set to true for development with mock data
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      if (mockMode) {
        // Use mock data for development
        setSession(mockSession);
        setIsLoading(false);
        return;
      }

      try {
        const { session: currentSession } = await authService.getSession();
        setSession(currentSession);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const { data } = mockMode 
      ? { data: null } 
      : authService.onAuthStateChange((updatedSession) => {
          setSession(updatedSession);
        });

    initAuth();

    return () => {
      if (data) data.subscription.unsubscribe();
    };
  }, [mockMode]);

  const signIn = async (credentials: SignInCredentials) => {
    setIsLoading(true);
    
    try {
      if (mockMode) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock sign in
        if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
          setSession(mockSession);
          toast({
            title: "Signed in successfully",
            description: "Welcome back, Demo User!",
          });
          return;
        }
        
        throw new Error('Invalid email or password');
      }

      const { session: newSession, error } = await authService.signIn(credentials);

      if (error) {
        throw error;
      }

      setSession(newSession);
      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${newSession?.user?.user_metadata?.first_name || 'User'}!`,
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
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    setIsLoading(true);
    
    try {
      if (mockMode) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock successful signup
        setSession(mockSession);
        toast({
          title: "Account created successfully",
          description: "Welcome to the platform!",
        });
        return;
      }

      const { user, error } = await authService.signUp(credentials);

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
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    
    try {
      if (mockMode) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSession(null);
        toast({
          title: "Signed out successfully",
        });
        return;
      }

      const { error } = await authService.signOut();

      if (error) {
        throw error;
      }

      setSession(null);
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
    }
  };

  const value = {
    session,
    user: session?.user || null,
    isLoading,
    isAuthenticated: !!session?.user,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
