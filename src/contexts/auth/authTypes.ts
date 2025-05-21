
import { User, Session } from '@/types/auth';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (credentials: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  signOut: () => Promise<void>;
}
