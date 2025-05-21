
import { supabase } from './supabase';
import type { ApiError } from '../types/api';

// Fixing the imports since the generated API client might not exist yet
// We'll use dynamic imports or placeholders to avoid TypeScript errors
let ApiClient: any;
let Models: any;

export const getApiBase = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8080';
};

// This function initializes the API clients with authentication
export const initializeApiClients = async () => {
  try {
    // Dynamic import to handle case where files might not exist yet
    const api = await import('../generated-api/api');
    const models = await import('../generated-api/models');
    
    ApiClient = api;
    Models = models;
    
    return { ApiClient, Models };
  } catch (error) {
    console.error('API client not generated yet. Please run "npm run generate-api" first.');
    return { ApiClient: null, Models: null };
  }
};

export const createApiClient = async <T>(ClientClass: new (...args: any[]) => T): Promise<T> => {
  const session = await supabase.auth.getSession();
  const token = session?.data?.session?.access_token;
  
  if (!ClientClass) {
    throw new Error('API client not initialized. Please run "npm run generate-api" first.');
  }
  
  const client = new ClientClass(getApiBase());
  
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
