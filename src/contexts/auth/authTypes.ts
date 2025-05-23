
import { User, Session } from '@/types/auth';
import { DomainProfile, DomainOrganization } from '@/generated-api/src/models';

// Simple profile type since we don't have a database table anymore
export interface UserProfile {
  first_name?: string;
  last_name?: string;
  role?: {
    name: string;
  };
  organization?: {
    id?: number;
    name: string;
  };
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isAuthenticated: boolean;
  profile: UserProfile | null;
  organization: DomainOrganization | null;
  isProfileLoading: boolean;
  isOrganizationLoading: boolean;
  updateProfile: (data: { first_name?: string; last_name?: string }) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  fetchBackendProfile: () => Promise<DomainProfile | null>;
  fetchOrganization: (organizationId: number) => Promise<DomainOrganization | null>;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (credentials: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}
