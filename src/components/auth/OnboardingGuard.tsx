import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, profile, organization, isProfileLoading, isOrganizationLoading } = useAuth();

  // Show loading while auth is being established
  if (isLoading || isProfileLoading || isOrganizationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but has no organization, redirect to onboarding
  if (isAuthenticated && !organization) {
    return <Navigate to="/onboard" replace />;
  }

  // User is authenticated and has an organization, show the protected content
  return <>{children}</>;
};