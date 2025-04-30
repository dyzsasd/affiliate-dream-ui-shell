
import { createClient } from '@supabase/supabase-js';
import { Organization, Permission, Profile, Role, Session, SignInCredentials, SignUpCredentials, User } from '../types/auth';
import { supabase } from '@/integrations/supabase/client';

// Export the client that uses the proper configuration from the project
export const supabaseClient = supabase;

export const authService = {
  async signUp({ email, password, firstName, lastName, organizationName }: SignUpCredentials): Promise<{ user: User | null; error: Error | null }> {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      return { user: null, error };
    }

    // If organization name is provided, create a new organization
    // Note: This only sets up the user - the organization creation will happen later
    // because we need the user to be confirmed first (or use admin API)
    
    return { user: data.user as User || null, error: null };
  },

  async signIn({ email, password }: SignInCredentials): Promise<{ session: Session | null; error: Error | null }> {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { session: null, error };
    }

    return { 
      session: data.session ? {
        user: data.session.user as User,
        access_token: data.session.access_token,
      } : null,
      error: null 
    };
  },

  async signOut(): Promise<{ error: Error | null }> {
    const { error } = await supabaseClient.auth.signOut();
    return { error };
  },

  async getSession(): Promise<{ session: Session | null; error: Error | null }> {
    const { data, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      return { session: null, error };
    }

    return { 
      session: data.session ? {
        user: data.session.user as User,
        access_token: data.session.access_token,
      } : null,
      error: null 
    };
  },

  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabaseClient.auth.onAuthStateChange((event, session) => {
      if (session) {
        callback({
          user: session.user as User,
          access_token: session.access_token,
        });
      } else {
        callback(null);
      }
    });
  },
  
  // Profile management
  async getProfile(): Promise<{ profile: Profile | null; error: Error | null }> {
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      return { profile: null, error: sessionError || new Error('No active session') };
    }
    
    const userId = sessionData.session.user.id;
    
    const { data, error } = await supabaseClient
      .from('profiles')
      .select(`
        *,
        role:role_id(role_id, name, description),
        organization:organization_id(organization_id, name, created_at, updated_at)
      `)
      .eq('id', userId)
      .single();
    
    if (error) {
      return { profile: null, error };
    }
    
    return { profile: data as Profile, error: null };
  },
  
  async createOrganization(name: string): Promise<{ organization: Organization | null; error: Error | null }> {
    const { data, error } = await supabaseClient
      .from('organizations')
      .insert({ name })
      .select()
      .single();
      
    if (error) {
      return { organization: null, error };
    }
    
    return { organization: data as Organization, error: null };
  },
  
  async updateProfile(profile: Partial<Profile>): Promise<{ success: boolean; error: Error | null }> {
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      return { success: false, error: sessionError || new Error('No active session') };
    }
    
    const userId = sessionData.session.user.id;
    
    const { error } = await supabaseClient
      .from('profiles')
      .update(profile)
      .eq('id', userId);
    
    if (error) {
      return { success: false, error };
    }
    
    return { success: true, error: null };
  },
  
  async getUserPermissions(): Promise<{ permissions: string[]; error: Error | null }> {
    const { data: profile, error: profileError } = await this.getProfile();
    
    if (profileError || !profile || !profile.role) {
      return { permissions: [], error: profileError || new Error('Unable to fetch profile') };
    }
    
    const { data, error } = await supabaseClient
      .from('role_permissions')
      .select(`
        permission:permission_id(name)
      `)
      .eq('role_id', profile.role.role_id);
    
    if (error) {
      return { permissions: [], error };
    }
    
    const permissions = data.map(item => item.permission.name);
    return { permissions, error: null };
  }
};

// For development purposes, we'll create a mock user
export const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  created_at: '2023-01-01T00:00:00Z',
  user_metadata: {
    first_name: 'Demo',
    last_name: 'User',
  },
};

export const mockSession: Session = {
  user: mockUser,
  access_token: 'mock-access-token',
};
