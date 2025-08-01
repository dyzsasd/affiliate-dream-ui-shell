
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types/auth';
import { UserProfile } from '../authTypes';
import { DomainProfile, DomainOrganization } from '@/generated-api/src/models';
import { 
  fetchBackendProfile, 
  fetchOrganization, 
  updateUserProfile, 
  checkPermission 
} from '@/services/profileService';
import {
  mapBackendProfileToUserProfile,
  createFallbackProfile,
  updateProfileWithOrganization
} from '../utils/profileMappers';

export const useProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<DomainOrganization | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isOrganizationLoading, setIsOrganizationLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const { toast } = useToast();

  // Single effect to load profile data when user changes
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user || profileLoaded) {
        return;
      }
      
      console.log("Loading profile data for user:", user.id);
      setIsProfileLoading(true);
      setProfileLoaded(true);
      
      try {
        // Fetch backend profile
        const backendProfile = await fetchBackendProfile(user);
        
        if (backendProfile) {
          const userProfile = mapBackendProfileToUserProfile(backendProfile);
          setProfile(userProfile);
          console.log("Profile loaded:", userProfile);
          
          // Check for organization ID and fetch organization
          const organizationId = (backendProfile as any).organization_id || backendProfile.organizationId;
          if (organizationId) {
            console.log("Loading organization:", organizationId);
            setIsOrganizationLoading(true);
            
            try {
              const org = await fetchOrganization(organizationId);
              if (org) {
                setOrganization(org);
                setProfile(prev => updateProfileWithOrganization(prev, organizationId, org.name || 'Unknown'));
              }
            } catch (orgError) {
              console.error("Failed to fetch organization:", orgError);
            } finally {
              setIsOrganizationLoading(false);
            }
          }
        } else {
          // Backend profile not found (404) - keep profile as null to trigger onboarding
          console.log("No backend profile found - user needs onboarding");
          setProfile(null);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        
        // Create fallback profile on error
        if (user.user_metadata) {
          const fallbackProfile = createFallbackProfile(user.user_metadata);
          setProfile(fallbackProfile);
        }
        
        toast({
          title: "Profile loading issue",
          description: "Using local profile data. Some features may be limited.",
          variant: "default",
        });
      } finally {
        setIsProfileLoading(false);
      }
    };

    if (user && !profileLoaded) {
      loadProfileData();
    } else if (!user) {
      // Reset state when user logs out
      setProfile(null);
      setOrganization(null);
      setProfileLoaded(false);
      setIsProfileLoading(false);
      setIsOrganizationLoading(false);
    }
  }, [user, profileLoaded, toast]);

  const handleFetchBackendProfile = async () => {
    if (!user) return null;
    
    setIsProfileLoading(true);
    try {
      const response = await fetchBackendProfile(user);
      if (response) {
        const userProfile = mapBackendProfileToUserProfile(response);
        setProfile(userProfile);
      }
      return response;
    } catch (error) {
      console.error('Error fetching backend profile:', error);
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleFetchOrganization = async (organizationId: number) => {
    if (!organizationId) return null;
    
    setIsOrganizationLoading(true);
    try {
      const org = await fetchOrganization(organizationId);
      if (org) {
        setOrganization(org);
        setProfile(prev => updateProfileWithOrganization(prev, organizationId, org.name || 'Unknown'));
      }
      return org;
    } catch (error) {
      console.error('Error fetching organization:', error);
      return null;
    } finally {
      setIsOrganizationLoading(false);
    }
  };

  const handleUpdateProfile = async (data: { first_name?: string; last_name?: string }) => {
    setIsProfileLoading(true);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      await updateUserProfile(user, data, profile);
      
      setProfile(prev => prev && ({
        ...prev,
        first_name: data.first_name || prev.first_name,
        last_name: data.last_name || prev.last_name
      }));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePermissionCheck = (permission: string) => {
    return checkPermission(user, profile, permission);
  };

  return {
    profile,
    setProfile,
    organization,
    isProfileLoading,
    isOrganizationLoading,
    fetchBackendProfile: handleFetchBackendProfile,
    fetchOrganization: handleFetchOrganization,
    updateProfile: handleUpdateProfile,
    hasPermission: handlePermissionCheck
  };
};
