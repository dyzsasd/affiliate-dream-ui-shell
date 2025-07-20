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

// JWT Token Manager State Machine
enum TokenState {
  INITIALIZING = 'initializing',
  AUTHENTICATED = 'authenticated', 
  REFRESHING = 'refreshing'
}

class JWTTokenManager {
  private state: TokenState = TokenState.INITIALIZING;
  public currentSession: any = null;
  private refreshPromise: Promise<any> | null = null;
  private pendingRequests: Array<{ resolve: Function; reject: Function }> = [];

  constructor() {
    this.initialize();
  }

  private async initialize() {
    console.log('JWT Manager: Initializing...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        this.currentSession = session;
        this.state = TokenState.AUTHENTICATED;
        console.log('JWT Manager: Initialized with existing session');
      } else {
        console.log('JWT Manager: No existing session found');
      }
    } catch (error) {
      console.error('JWT Manager: Error during initialization:', error);
    }
  }

  private isTokenExpiringSoon(expiresAt: number): boolean {
    if (!expiresAt) return true;
    
    const expirationTime = expiresAt * 1000;
    const currentTime = new Date().getTime();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    return currentTime + bufferTime >= expirationTime;
  }

  async getValidToken(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      // If we're initializing, wait for initialization to complete
      if (this.state === TokenState.INITIALIZING) {
        console.log('JWT Manager: Currently initializing, queueing request');
        this.pendingRequests.push({ resolve, reject });
        return;
      }

      // If we're refreshing, queue the request
      if (this.state === TokenState.REFRESHING) {
        console.log('JWT Manager: Currently refreshing, queueing request');
        this.pendingRequests.push({ resolve, reject });
        return;
      }

      // If authenticated, check if token needs refresh
      if (this.state === TokenState.AUTHENTICATED) {
        if (this.currentSession?.access_token && 
            (!this.currentSession.expires_at || !this.isTokenExpiringSoon(this.currentSession.expires_at))) {
          resolve(this.currentSession.access_token);
          return;
        }

        // Token needs refresh
        this.pendingRequests.push({ resolve, reject });
        this.refreshToken();
        return;
      }

      reject(new Error('No valid session available'));
    });
  }

  async refreshTokenOnError(): Promise<string | null> {
    if (this.state !== TokenState.AUTHENTICATED) {
      console.log('JWT Manager: Cannot refresh token, not in authenticated state');
      return null;
    }

    return new Promise((resolve, reject) => {
      this.pendingRequests.push({ resolve, reject });
      this.refreshToken();
    });
  }

  private async refreshToken() {
    if (this.state === TokenState.REFRESHING) {
      console.log('JWT Manager: Refresh already in progress');
      return;
    }

    this.state = TokenState.REFRESHING;
    console.log('JWT Manager: Starting token refresh');

    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        console.error('JWT Manager: Token refresh failed:', error);
        this.state = TokenState.INITIALIZING;
        this.currentSession = null;
        this.rejectPendingRequests(new Error('Token refresh failed'));
        return;
      }

      this.currentSession = data.session;
      this.state = TokenState.AUTHENTICATED;
      console.log('JWT Manager: Token refreshed successfully');
      
      // Resolve all pending requests
      this.resolvePendingRequests(data.session.access_token);
    } catch (error) {
      console.error('JWT Manager: Exception during token refresh:', error);
      this.state = TokenState.INITIALIZING;
      this.currentSession = null;
      this.rejectPendingRequests(error);
    }
  }

  private resolvePendingRequests(token: string) {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];
    
    requests.forEach(({ resolve }) => {
      resolve(token);
    });
  }

  private rejectPendingRequests(error: any) {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];
    
    requests.forEach(({ reject }) => {
      reject(error);
    });
  }

  // Update session when auth state changes
  updateSession(session: any) {
    if (session) {
      this.currentSession = session;
      this.state = TokenState.AUTHENTICATED;
      console.log('JWT Manager: Session updated from auth state change');
    } else {
      this.currentSession = null;
      this.state = TokenState.INITIALIZING;
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
  if (!ClientClass) {
    throw new Error('API client not initialized. Please run "npm run generate-api" first.');
  }
  
  // Ensure we have a valid token before creating the client
  const token = await tokenManager.getValidToken();
  if (!token) {
    throw new Error('No valid authentication token found. Please log in again.');
  }
  
  const baseUrl = getApiBase();
  console.log('Creating API client with base URL:', baseUrl);
  
  // Create configuration with proper authentication and retry logic
  const configuration = new Configuration({
    basePath: baseUrl,
    apiKey: async (name: string) => {
      if (name === 'Authorization') {
        try {
          const token = await tokenManager.getValidToken();
          if (token) {
            console.log('Using auth token for API request');
            return `Bearer ${token}`;
          } else {
            console.warn('No valid token found for API request');
            return '';
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
          return '';
        }
      }
      return '';
    },
    middleware: [{
      post: async (context) => {
        // Check if response is 401 or 403 and retry with fresh token
        if (context.response.status === 401 || context.response.status === 403) {
          console.log(`Received ${context.response.status} response, attempting to refresh token and retry...`);
          
          try {
            // Use token manager to refresh token
            const refreshedToken = await tokenManager.refreshTokenOnError();
            
            if (!refreshedToken) {
              console.error('Failed to refresh token for retry');
              return context.response;
            }
            
            console.log('Token refreshed for retry, retrying request with new token...');
            
            // Create new headers with fresh token
            const newHeaders = new Headers(context.init.headers);
            newHeaders.set('Authorization', `Bearer ${refreshedToken}`);
            
            // Clone the original request init but with new headers
            const retryInit = {
              ...context.init,
              headers: newHeaders
            };
            
            // Retry the request with fresh token
            const retryResponse = await fetch(context.url, retryInit);
            
            console.log('Retry response status:', retryResponse.status);
            
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
