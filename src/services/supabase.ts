
import { supabase } from '@/integrations/supabase/client';

// Export the client that uses the proper configuration from the project
export const supabaseClient = supabase;

// For development purposes, we'll create a mock user
export const mockUser = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  created_at: '2023-01-01T00:00:00Z',
  user_metadata: {
    first_name: 'Demo',
    last_name: 'User',
  },
};

export const mockSession = {
  user: mockUser,
  access_token: 'mock-access-token',
};
