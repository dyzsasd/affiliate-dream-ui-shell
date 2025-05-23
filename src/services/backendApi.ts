
import { supabase } from '@/integrations/supabase/client';
import type { Campaign } from '../types/api';

// Using the host provided by environment variable with proper fallback
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api/v1';

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

export const createApiClient = async <T>(ClientClass: new (...args: any[]) => T): Promise<T> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!ClientClass) {
    throw new Error('API client not initialized. Please run "npm run generate-api" first.');
  }
  
  const baseUrl = getApiBase();
  console.log('Creating API client with base URL:', baseUrl);
  console.log('Auth token available:', !!token);
  
  // Create the client with proper configuration
  const client = new ClientClass(baseUrl);
  
  // Add auth token to each request if available
  if (token) {
    // Configure the client to use the token for authentication
    // We'll configure it to be used as a Bearer token
    const configuration = new Configuration({
      basePath: baseUrl,
      accessToken: token
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
  
  constructor(config: { basePath?: string; accessToken?: string }) {
    this.basePath = config.basePath;
    this.accessToken = config.accessToken;
  }
  
  // This function will be called by the generated API client to get the access token
  apiKey = async (name: string): Promise<string> => {
    if (name === 'Authorization' && this.accessToken) {
      return `Bearer ${this.accessToken}`;
    }
    return '';
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
