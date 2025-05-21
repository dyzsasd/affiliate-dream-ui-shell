
import { Profile, Session, SignInCredentials, SignUpCredentials, User, Permission } from '@/types/auth';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  permissions: string[];
  isLoading: boolean;
  isSubmitting: boolean;
  isProfileLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  createOrganization: (name: string) => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  refreshProfile: () => Promise<void>;
}
