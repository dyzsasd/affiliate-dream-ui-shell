
import { supabase } from '@/integrations/supabase/client';
import type { Campaign } from '../types/api';

// Using the host provided by environment variable with proper fallback
// In production, we should use relative URLs to avoid CORS issues
const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalDevelopment 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api/v1'
  : '/api/v1'; // Use relative URL in production

// Define a simple ApiError interface here since it's not exported from types/api
interface ApiError {
  message: string;
  status: number;
}

// This function initializes the API clients with authentication
export const initializeApiClients = async () => {
  try {
    // Dynamic import to handle case where files might not exist yet
    const api = await import('../generated-api/src/apis');
    const models = await import('../generated-api/src/models');
    
    return { ApiClient: api, Models: models };
  } catch (error) {
    console.error('API client not generated yet. Please run "npm run generate-api" first.');
    return { ApiClient: null, Models: null };
  }
};

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

export const createApiClient = async <T>(ClientClass: new (...args: any[]) => T): Promise<T> => {
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
  
  // Create the client with proper configuration
  const client = new ClientClass(baseUrl);
  
  // Add auth token to each request if available
  if (token) {
    // Configure the client to use the token for authentication
    // We'll configure it to be used as a Bearer token
    const configuration = new Configuration({
      basePath: baseUrl,
      accessToken: token,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
    });
    
    // @ts-ignore - Setting the configuration for the client
    client.configuration = configuration;
    
    // Also add a middleware to log request details for debugging
    // @ts-ignore - Ensure middleware is an array
    client.middleware = client.middleware || [];
    
    // @ts-ignore - Add a middleware to log the request
    client.middleware.push({
      pre: async (context) => {
        console.log('API Request:', context.url);
        console.log('Headers:', context.init.headers);
        
        // Ensure the Authorization header is set correctly
        if (token && (!context.init.headers || !context.init.headers['Authorization'])) {
          context.init.headers = context.init.headers || {};
          context.init.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Add CORS mode to every request
        context.init.mode = 'cors';
        context.init.credentials = 'include';
        
        return context;
      }
    });
    
    console.log('Auth token configured for API client');
  }
  
  return client;
};

// Add a proper Configuration class
class Configuration {
  basePath?: string;
  accessToken?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  
  constructor(config: { 
    basePath?: string; 
    accessToken?: string; 
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
    mode?: RequestMode;
  }) {
    this.basePath = config.basePath;
    this.accessToken = config.accessToken;
    this.headers = config.headers || {};
    this.credentials = config.credentials || 'same-origin';
    this.mode = config.mode || 'cors';
  }
  
  // This function will be called by the generated API client to get the access token
  apiKey = async (name: string): Promise<string> => {
    if (name === 'Authorization' && this.accessToken) {
      return `Bearer ${this.accessToken}`;
    }
    return '';
  }
  
  // Method to get headers for all requests
  getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      ...this.headers,
    };
    
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    
    return headers;
  }
}

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
