
import { supabase } from '@/integrations/supabase/client';
import { Configuration } from '@/generated-api/src/runtime';

// Using the host provided by environment variable with proper fallback
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api/v1';

// Define a simple ApiError interface
interface ApiError {
  message: string;
  status: number;
}

export const getApiBase = () => {
  // Make sure the API_BASE_URL does not have trailing slash
  return API_BASE_URL.replace(/\/+$/, '');
};

// Check if a token is close to expiring (within 5 minutes)
export const isTokenExpiringSoon = (expiresAt: number): boolean => {
  if (!expiresAt) return true;
  
  // Convert expiresAt from seconds to milliseconds and add buffer time (5 minutes)
  const expirationTime = expiresAt * 1000;
  const currentTime = new Date().getTime();
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  return currentTime + bufferTime >= expirationTime;
};

// Get the current valid auth tokens or refresh if needed
export const getAuthTokens = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session exists, return null
  if (!session) {
    console.log('No session found');
    return null;
  }
  
  // Check if token is expiring soon and needs refresh
  if (session.expires_at && isTokenExpiringSoon(session.expires_at)) {
    console.log('Token is expiring soon, refreshing...');
    
    try {
      // Attempt to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing token:', error);
        return null;
      }
      
      console.log('Token refreshed successfully');
      return data.session;
    } catch (refreshError) {
      console.error('Exception during token refresh:', refreshError);
      return null;
    }
  }
  
  return session;
};

export const createApiClient = async <T>(ClientClass: new (configuration?: Configuration) => T): Promise<T> => {
  // Get fresh session with possibly refreshed token
  const session = await getAuthTokens();
  const token = session?.access_token;
  
  if (!ClientClass) {
    throw new Error('API client not initialized. Please run "npm run generate-api" first.');
  }
  
  const baseUrl = getApiBase();
  console.log('Creating API client with base URL:', baseUrl);
  console.log('Auth token available:', !!token);
  
  // Log token expiry if available
  if (session?.expires_at) {
    const expiryDate = new Date(session.expires_at * 1000);
    console.log('Token expires at:', expiryDate.toISOString());
  }
  
  // Create configuration with proper authentication
  const configuration = new Configuration({
    basePath: baseUrl,
    apiKey: async (name: string) => {
      if (name === 'Authorization' && token) {
        return `Bearer ${token}`;
      }
      return '';
    }
  });
  
  // Create the client with proper configuration
  const client = new ClientClass(configuration);
  
  console.log('API client created successfully');
  
  return client;
};

export const handleApiError = (error: unknown): ApiError => {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }
  
  return {
    message: 'Unknown API error occurred',
    status: 500,
  };
};
