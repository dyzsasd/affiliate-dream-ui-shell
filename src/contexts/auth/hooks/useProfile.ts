
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
  const [backendFetchAttempted, setBackendFetchAttempted] = useState(false);
  const { toast } = useToast();

  const handleFetchBackendProfile = async () => {
    if (!user) {
      console.log("Cannot fetch profile: No user is logged in");
      return null;
    }
    
    // Prevent multiple fetch attempts if the backend is not available
    if (backendFetchAttempted) {
      console.log("Already attempted to fetch backend profile, using local data");
      return null;
    }
    
    setIsProfileLoading(true);
    setBackendFetchAttempted(true);
    
    try {
      const response = await fetchBackendProfile(user);
      
      // Update local profile state with fetched data
      if (response) {
        const userProfile = mapBackendProfileToUserProfile(response);
        setProfile(userProfile);
        
        // If we have an organization ID, fetch the organization details
        if (response.organizationId) {
          await handleFetchOrganization(response.organizationId);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching backend profile:', error);
      
      // Initialize profile from user metadata as fallback
      if (user?.user_metadata) {
        setProfile(createFallbackProfile(user.user_metadata));
      }
      
      toast({
        title: "Using local profile data",
        description: "Could not connect to backend server. Using local profile data instead.",
        variant: "default",
      });
      
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleFetchOrganization = async (organizationId: number) => {
    setIsOrganizationLoading(true);
    
    try {
      const org = await fetchOrganization(organizationId);
      
      if (org) {
        // Update organization state
        setOrganization(org);
        
        // Update the organization name in the profile
        setProfile(prevProfile => 
          updateProfileWithOrganization(prevProfile, organizationId, org.name)
        );
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
