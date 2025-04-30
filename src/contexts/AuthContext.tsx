import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, SignInCredentials, SignUpCredentials, User, Profile, Permission } from '../types/auth';
import { authService, mockSession } from '../services/supabase';
import { useToast } from "@/hooks/use-toast";

// Define the mockUser for development purposes
const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  created_at: '2023-01-01T00:00:00Z',
  user_metadata: {
    first_name: 'Demo',
    last_name: 'User',
  },
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  permissions: string[];
  isLoading: boolean;
  isProfileLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  createOrganization: (name: string) => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; mockMode?: boolean }> = ({ 
  children,
  mockMode = false // Set to true for development with mock data
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!session?.user) return;
    
    setIsProfileLoading(true);
    try {
      const { profile, error } = await authService.getProfile();
      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Failed to fetch profile",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setProfile(profile);
        
        // Fetch permissions
        const { permissions, error: permissionsError } = await authService.getUserPermissions();
        if (!permissionsError) {
          setPermissions(permissions);
        }
      }
    } catch (error: any) {
      console.error("Error in profile fetch:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };
  
  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    const initAuth = async () => {
      if (mockMode) {
        // Use mock data for development
        setSession(mockSession);
        setProfile({
          id: mockUser.id,
          first_name: mockUser.user_metadata?.first_name || null,
          last_name: mockUser.user_metadata?.last_name || null,
          organization_id: 1,
          role_id: 1,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          role: {
            role_id: 1,
            name: 'Admin',
            description: 'Platform Administrator with full access'
          },
          organization: {
            organization_id: 1,
            name: 'Demo Organization',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z'
          }
        });
        setPermissions([
          'manage_organizations',
          'manage_users',
          'manage_roles_permissions',
          'manage_advertisers',
          'manage_affiliates',
          'create_campaign',
          'view_all_campaigns',
          'view_all_reports',
          'manage_conversions',
          'manage_billing'
        ]);
        setIsLoading(false);
        return;
      }

      try {
        const { session: currentSession } = await authService.getSession();
        setSession(currentSession);
        if (currentSession?.user) {
          await fetchProfile();
        }
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
          if (updatedSession?.user) {
            // Use setTimeout to prevent recursion issues with Supabase client
            setTimeout(() => {
              fetchProfile();
            }, 0);
          } else {
            setProfile(null);
            setPermissions([]);
          }
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
          setProfile({
            id: mockUser.id,
            first_name: mockUser.user_metadata?.first_name || null,
            last_name: mockUser.user_metadata?.last_name || null,
            organization_id: 1,
            role_id: 1,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
            role: {
              role_id: 1,
              name: 'Admin',
              description: 'Platform Administrator with full access'
            },
            organization: {
              organization_id: 1,
              name: 'Demo Organization',
              created_at: '2023-01-01T00:00:00Z',
              updated_at: '2023-01-01T00:00:00Z'
            }
          });
          setPermissions([
            'manage_organizations',
            'manage_users',
            'manage_roles_permissions',
            'manage_advertisers',
            'manage_affiliates',
            'create_campaign',
            'view_all_campaigns',
            'view_all_reports',
            'manage_conversions',
            'manage_billing'
          ]);
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
      
      // We'll fetch the profile in the onAuthStateChange handler
      
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

      // If organization name is provided, create a new organization
      if (user && credentials.organizationName) {
        // Note: In a real implementation, you would need to use admin APIs or
        // edge functions to create the organization and link it to the new user
        toast({
          title: "Organization creation requested",
          description: "Your organization will be set up once your account is verified.",
        });
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
        setProfile(null);
        setPermissions([]);
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
      setProfile(null);
      setPermissions([]);
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
  
  const createOrganization = async (name: string) => {
    try {
      const { organization, error } = await authService.createOrganization(name);
      
      if (error) {
        throw error;
      }
      
      if (organization) {
        // Update the user's profile to link to the new organization
        await updateProfile({ organization_id: organization.organization_id });
        
        toast({
          title: "Organization created",
          description: `${name} has been created successfully.`,
        });
        
        await refreshProfile();
      }
    } catch (error: any) {
      toast({
        title: "Failed to create organization",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const updateProfile = async (profileUpdate: Partial<Profile>) => {
    try {
      const { success, error } = await authService.updateProfile(profileUpdate);
      
      if (error) {
        throw error;
      }
      
      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        
        await refreshProfile();
      }
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const value = {
    session,
    user: session?.user || null,
    profile,
    permissions,
    isLoading,
    isProfileLoading,
    isAuthenticated: !!session?.user,
    signIn,
    signUp,
    signOut,
    createOrganization,
    updateProfile,
    hasPermission,
    refreshProfile,
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
