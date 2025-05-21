
import { Configuration, ConfigurationParameters } from '../generated-api';
import { supabase } from '../integrations/supabase/client';

// Import all the API classes from the generated code
// Note: These imports will work once the client is generated
import {
  AdvertisersApi,
  AffiliatesApi,
  CampaignsApi,
  OrganizationsApi,
  ProfileApi,
  WebhooksApi
} from '../generated-api/api';

// Re-export models for convenience
export * from '../generated-api/models';

class BackendApiService {
  private baseUrl: string;
  private configuration: Configuration;
  
  // API instances
  public advertisers: AdvertisersApi;
  public affiliates: AffiliatesApi;
  public campaigns: CampaignsApi;
  public organizations: OrganizationsApi;
  public profile: ProfileApi;
  public webhooks: WebhooksApi;

  constructor() {
    // This would typically come from environment variables
    this.baseUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8080/api/v1';
    
    // Initialize configuration with auth handling
    this.configuration = new Configuration({
      basePath: this.baseUrl,
      middleware: [
        {
          pre: async (context) => {
            // Get current session
            const { data } = await supabase.auth.getSession();
            
            // If we have a session, add the token to the request
            if (data.session?.access_token) {
              context.init.headers = {
                ...context.init.headers,
                Authorization: `Bearer ${data.session.access_token}`,
              };
            }
            
            return context;
          },
        },
      ],
    });

    // Initialize API instances
    this.advertisers = new AdvertisersApi(this.configuration);
    this.affiliates = new AffiliatesApi(this.configuration);
    this.campaigns = new CampaignsApi(this.configuration);
    this.organizations = new OrganizationsApi(this.configuration);
    this.profile = new ProfileApi(this.configuration);
    this.webhooks = new WebhooksApi(this.configuration);
  }

  // Method to reinitialize the API client (e.g., after login/logout)
  public reinitialize(): void {
    this.configuration = new Configuration({
      basePath: this.baseUrl,
      middleware: [
        {
          pre: async (context) => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.access_token) {
              context.init.headers = {
                ...context.init.headers,
                Authorization: `Bearer ${data.session.access_token}`,
              };
            }
            return context;
          },
        },
      ],
    });

    this.advertisers = new AdvertisersApi(this.configuration);
    this.affiliates = new AffiliatesApi(this.configuration);
    this.campaigns = new CampaignsApi(this.configuration);
    this.organizations = new OrganizationsApi(this.configuration);
    this.profile = new ProfileApi(this.configuration);
    this.webhooks = new WebhooksApi(this.configuration);
  }
}

// Create and export a singleton instance
export const backendApi = new BackendApiService();
