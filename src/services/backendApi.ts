import { supabase } from '@/integrations/supabase/client';
import { Configuration } from '@/generated-api/src/runtime';

// Using the production API URL
const DEFAULT_API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.affiliate.rolinko.com') + '/api/v1';

// Define a simple ApiError interface
interface ApiError {
  message: string;
  status: number;
}

export const getApiBase = () => {
  // Check for debug mode backend URL override
  const debugUrl = localStorage.getItem('debug_backend_url');
  const baseUrl = debugUrl || DEFAULT_API_BASE_URL;
  
  // Make sure the API_BASE_URL does not have trailing slash
  return baseUrl.replace(/\/+$/, '');
};

// Simple JWT Token Manager - No Refresh Logic
class JWTTokenManager {
  public currentSession: any = null;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    console.log('JWT Manager: Initializing...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        this.currentSession = session;
        console.log('JWT Manager: Initialized with existing session');
      } else {
        console.log('JWT Manager: No existing session found');
      }
      this.initialized = true;
    } catch (error) {
      console.error('JWT Manager: Error during initialization:', error);
      this.initialized = true;
    }
  }

  async getValidToken(): Promise<string | null> {
    // Wait for initialization if not done yet
    while (!this.initialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Return the same token always, no expiration checks
    if (this.currentSession?.access_token) {
      console.log('JWT Manager: Serving existing token');
      return this.currentSession.access_token;
    }

    console.log('JWT Manager: No token available');
    return null;
  }

  // Update session when auth state changes - only sets, never refreshes
  updateSession(session: any) {
    if (session) {
      this.currentSession = session;
      console.log('JWT Manager: Session updated from auth state change');
    } else {
      this.currentSession = null;
      console.log('JWT Manager: Session cleared from auth state change');
    }
  }
}

// Global token manager instance
const tokenManager = new JWTTokenManager();

// Listen to auth state changes to update the token manager
supabase.auth.onAuthStateChange((event, session) => {
  console.log('JWT Manager: Auth state changed:', event);
  tokenManager.updateSession(session);
});

// Export the token manager for direct use
export { tokenManager };

// Legacy function for backward compatibility - returns full session object
export const getAuthTokens = async () => {
  try {
    const token = await tokenManager.getValidToken();
    if (token && tokenManager.currentSession) {
      return tokenManager.currentSession;
    }
    return null;
  } catch (error) {
    console.error('Error getting auth tokens:', error);
    return null;
  }
};

// Create API client with proper session validation using the token manager
export const createApiClient = async <T>(ClientClass: new (configuration?: Configuration) => T): Promise<T> => {
  console.log('🔧 Creating API client for:', ClientClass.name);
  
  if (!ClientClass) {
    throw new Error('API client not initialized. Please run "npm run generate-api" first.');
  }
  
  // Ensure we have a valid token before creating the client
  const token = await tokenManager.getValidToken();
  console.log('🔑 Pre-creation token check:', token ? 'Present' : 'Missing');
  if (!token) {
    throw new Error('No valid authentication token found. Please log in again.');
  }
  
  const baseUrl = getApiBase();
  console.log('🌐 Creating API client with base URL:', baseUrl);
  
  // Create configuration with proper authentication and retry logic
  const configuration = new Configuration({
    basePath: baseUrl,
    apiKey: async (name: string) => {
      console.log('🔐 API Key requested for parameter:', name);
      if (name === 'Authorization') {
        try {
          const token = await tokenManager.getValidToken();
          console.log('🎫 Token retrieved for API request:', token ? `Present (${token.substring(0, 20)}...)` : 'Missing');
          if (token) {
            const authHeader = `Bearer ${token}`;
            console.log('✅ Using auth header for API request:', authHeader.substring(0, 30) + '...');
            return authHeader;
          } else {
            console.warn('❌ No valid token found for API request');
            return '';
          }
        } catch (error) {
          console.error('💥 Error getting auth token:', error);
          return '';
        }
      }
      console.log('⚪ Non-authorization parameter, returning empty string');
      return '';
    },
    // No middleware - no token refresh logic
  });
  
  // Create the client with proper configuration
  console.log('🔨 Creating client instance with configuration:', {
    basePath: configuration.basePath,
    hasApiKey: !!configuration.apiKey,
    configKeys: Object.keys(configuration)
  });
  
  const client = new ClientClass(configuration);
  
  console.log('✅ API client created successfully with methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(client)));
  console.log('🔍 Client instance created, checking if apiKey function is accessible');
  
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
