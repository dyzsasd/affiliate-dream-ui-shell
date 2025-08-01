import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, profile, organization, isProfileLoading, isOrganizationLoading } = useAuth();
  const location = useLocation();

  // Show loading while auth is being established
  if (isLoading || isProfileLoading || isOrganizationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but has no profile, allow access to onboarding pages
  if (isAuthenticated && !profile && !isProfileLoading) {
    // User needs onboarding - allow access to onboard pages
    if (location.pathname.startsWith('/onboard')) {
      return <>{children}</>;
    }
    // User is not on onboard page but needs onboarding - redirect them
    return <Navigate to="/onboard" replace />;
  }

  // If user has profile and tries to access onboard page, redirect to home
  if (isAuthenticated && profile && location.pathname.startsWith('/onboard')) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has a profile, show the protected content
  return <>{children}</>;
};