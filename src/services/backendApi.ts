
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
  
  // Create the client with proper configuration
  const client = new ClientClass(baseUrl);
  
  // Ensure middleware is initialized as an array
  // @ts-ignore - We need to access the private property to fix the issue
  if (!client.middleware || !Array.isArray(client.middleware)) {
    // @ts-ignore - Setting middleware to an empty array if it doesn't exist
    client.middleware = [];
  }
  
  // Add auth token to each request if available
  if (token) {
    // @ts-ignore - We know this might not be typed correctly until API is generated
    client.accessToken = token;
  }
  
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
