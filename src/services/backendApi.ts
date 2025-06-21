import { supabase } from '@/integrations/supabase/client';
import { Configuration } from '@/generated-api/src/runtime';

// Using the production API URL
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.affiliate.rolinko.com') + '/api/v1';

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

// Create API client with automatic retry on 401
export const createApiClient = async <T>(ClientClass: new (configuration?: Configuration) => T): Promise<T> => {
  if (!ClientClass) {
    throw new Error('API client not initialized. Please run "npm run generate-api" first.');
  }
  
  const baseUrl = getApiBase();
  console.log('Creating API client with base URL:', baseUrl);
  
  // Create configuration with proper authentication and retry logic
  const configuration = new Configuration({
    basePath: baseUrl,
    apiKey: async (name: string) => {
      if (name === 'Authorization') {
        const session = await getAuthTokens();
        if (session?.access_token) {
          console.log('Using auth token for API request');
          return `Bearer ${session.access_token}`;
        }
      }
      return '';
    },
    middleware: [{
      post: async (context) => {
        // Check if response is 401 and retry with fresh token
        if (context.response.status === 401) {
          console.log('Received 401 response, attempting to refresh token and retry...');
          
          try {
            // Force refresh the session
            const { data, error } = await supabase.auth.refreshSession();
            
            if (error || !data.session?.access_token) {
              console.error('Failed to refresh token for retry:', error);
              return context.response;
            }
            
            console.log('Token refreshed for retry, retrying request with new token...');
            
            // Create new headers with fresh token
            const newHeaders = new Headers(context.init.headers);
            newHeaders.set('Authorization', `Bearer ${data.session.access_token}`);
            
            // Clone the original request init but with new headers
            const retryInit = {
              ...context.init,
              headers: newHeaders
            };
            
            // Retry the request with fresh token
            const retryResponse = await fetch(context.url, retryInit);
            
            console.log('Retry response status:', retryResponse.status);
            
            // If retry is successful, the auth state change will automatically update
            // the session state for future requests
            return retryResponse;
          } catch (retryError) {
            console.error('Error during retry:', retryError);
            return context.response;
          }
        }
        
        return context.response;
      }
    }]
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
