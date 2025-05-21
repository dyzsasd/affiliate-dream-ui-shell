import { supabase } from '@/integrations/supabase/client';
import { BASE_URL } from './api';

// Create a TypeScript declaration file for the generated API

// Import the API - we'll try/catch to handle the case where it hasn't been generated yet
let DefaultApi, OrganizationsApi, AdvertisersApi, AffiliatesApi, CampaignsApi;
try {
  const api = require('../generated-api/api');
  DefaultApi = api.DefaultApi;
  OrganizationsApi = api.OrganizationsApi;
  AdvertisersApi = api.AdvertisersApi;
  AffiliatesApi = api.AffiliatesApi;
  CampaignsApi = api.CampaignsApi;
} catch (error) {
  console.error('API client not generated yet. Please run "npm run generate-api" first.');
}

// Define the API URL from environment variables or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create API client with auth
const createApiClientWithAuth = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const requestOptions = {
    headers,
  };
  
  return {
    organizations: OrganizationsApi ? new OrganizationsApi(undefined, API_URL, requestOptions) : null,
    advertisers: AdvertisersApi ? new AdvertisersApi(undefined, API_URL, requestOptions) : null,
    affiliates: AffiliatesApi ? new AffiliatesApi(undefined, API_URL, requestOptions) : null,
    campaigns: CampaignsApi ? new CampaignsApi(undefined, API_URL, requestOptions) : null,
    default: DefaultApi ? new DefaultApi(undefined, API_URL, requestOptions) : null,
  };
};

// Export the backend API
const backendApi = {
  createApiClientWithAuth,
};

export default backendApi;
