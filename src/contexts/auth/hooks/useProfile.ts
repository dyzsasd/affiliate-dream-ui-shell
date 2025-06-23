
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
  const { toast } = useToast();

  const handleFetchBackendProfile = async () => {
    if (!user) {
      console.log("Cannot fetch profile: No user is logged in");
      return null;
    }
    
    console.log("Starting backend profile fetch for user:", user.id);
    setIsProfileLoading(true);
    
    try {
      console.log("Fetching backend profile for user:", user.id);
      const response = await fetchBackendProfile(user);
      console.log("Backend profile response:", response);
      
      // Update local profile state with fetched data
      if (response) {
        const userProfile = mapBackendProfileToUserProfile(response);
        setProfile(userProfile);
        console.log("Profile set from backend data:", userProfile);
        
        // Check for organization_id in the raw response (snake_case from backend)
        const organizationId = (response as any).organization_id || response.organizationId;
        console.log("Looking for organization ID in response:", { 
          organization_id: (response as any).organization_id,
          organizationId: response.organizationId,
          finalId: organizationId 
        });
        
        // Return the response with the organization ID so calling code can use it
        return { ...response, organizationId };
      } else {
        console.log("No profile data received from backend");
        
        // Initialize profile from user metadata as fallback
        if (user?.user_metadata) {
          const fallbackProfile = createFallbackProfile(user.user_metadata);
          setProfile(fallbackProfile);
          console.log("Created fallback profile from metadata:", fallbackProfile);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching backend profile:', error);
      
      // Initialize profile from user metadata as fallback
      if (user?.user_metadata) {
        const fallbackProfile = createFallbackProfile(user.user_metadata);
        setProfile(fallbackProfile);
        console.log("Created fallback profile from metadata after error:", fallbackProfile);
      }
      
      toast({
        title: "Using local profile data",
        description: "Could not connect to backend server. Using local profile data instead.",
        variant: "default",
      });
      
      return null;
    } finally {
      setIsProfileLoading(false);
      console.log("Backend profile fetch completed");
    }
  };

  const handleFetchOrganization = async (organizationId: number) => {
    if (!organizationId) {
      console.log("Cannot fetch organization: Invalid organization ID");
      return null;
    }
    
    console.log("Starting organization fetch for ID:", organizationId);
    setIsOrganizationLoading(true);
    
    try {
      console.log("Fetching organization data for ID:", organizationId);
      const org = await fetchOrganization(organizationId);
      console.log("Organization data received:", org);
      
      if (org) {
        // Update organization state
        setOrganization(org);
        console.log("Organization state updated:", org);
        
        // Update the organization name in the profile
        setProfile(prevProfile => {
          const updatedProfile = updateProfileWithOrganization(
            prevProfile, 
            organizationId, 
            org.name || 'Unknown Organization'
          );
          console.log("Updated profile with organization:", updatedProfile);
          return updatedProfile;
        });
      } else {
        console.log("No organization data received");
      }
      
      return org;
    } catch (error) {
      console.error('Error fetching organization:', error);
      toast({
        title: "Organization data unavailable",
        description: "Could not fetch organization details from the server.",
        variant: "default",
      });
      return null;
    } finally {
      setIsOrganizationLoading(false);
      console.log("Organization fetch completed");
    }
  };

  const handleUpdateProfile = async (data: { first_name?: string; last_name?: string }) => {
    setIsProfileLoading(true);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update profile in both auth and backend services
      await updateUserProfile(user, data, profile);
      
      // After successful update to backend, update local state
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
