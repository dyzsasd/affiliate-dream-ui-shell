
import { createClient } from '@supabase/supabase-js';
import { Session, SignInCredentials, SignUpCredentials, User } from '../types/auth';
import { supabase } from '@/integrations/supabase/client';

// Export the client that uses the proper configuration from the project
export const supabaseClient = supabase;

export const authService = {
  async signUp({ email, password, firstName, lastName }: SignUpCredentials): Promise<{ user: User | null; error: Error | null }> {
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
