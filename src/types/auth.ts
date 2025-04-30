
export interface User {
  id: string;
  email: string;
  created_at?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  organization_id: number | null;
  role_id: number;
  created_at: string;
  updated_at: string;
  role?: Role;
  organization?: Organization;
}

export interface Role {
  role_id: number;
  name: string;
  description: string | null;
}

export interface Organization {
  organization_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  permission_id: number;
  name: string;
  description: string | null;
}

export interface Session {
  user: User | null;
  access_token: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  firstName?: string;
  lastName?: string;
  organizationName?: string;
}
