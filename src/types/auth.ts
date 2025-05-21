
export interface User {
  id: string;
  email: string;
  created_at?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
}

export interface Session {
  user: User | null;
  access_token: string | null;
}
