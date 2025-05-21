import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types/auth';
import { UserProfile } from '../authTypes';
import { ProfileApi } from '@/generated-api/src/apis/ProfileApi';
import { createApiClient, handleApiError } from '@/services/backendApi';
import { HandlersProfileRequest } from '@/generated-api/src/models';

export const useProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const { toast } = useToast();

  const fetchBackendProfile = async () => {
    try {
      console.log("Fetching backend profile...");
      const profileApi = await createApiClient(ProfileApi);
      console.log("ProfileApi client created successfully");
      
      const response = await profileApi.usersMeGet();
      console.log("Backend profile fetched:", response);
      return response;
    } catch (error) {
      console.error('Error fetching backend profile:', error);
      toast({
        title: "Error loading profile",
        description: "Could not load your profile from the server.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProfile = async (data: { first_name?: string; last_name?: string }) => {
    setIsProfileLoading(true);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Step 1: Update user metadata in Supabase Auth (keep this part for authentication)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        }
      });

      if (authError) {
        throw authError;
      }

      // Step 2: Update profile in backend service
      try {
        const profileApi = await createApiClient(ProfileApi);
        
        // Create profile update request
        const profileRequest: HandlersProfileRequest = {
          firstName: data.first_name,
          lastName: data.last_name
        };

        if (user.id) {
          // Update profile in backend - assumes the backend API has this functionality
          await profileApi.profilesIdPut({
            id: user.id,
            profile: profileRequest
          });
        }
      } catch (backendError) {
        console.error('Error updating backend profile:', backendError);
        // Continue with the local update even if the backend update fails
        // We could add a retry mechanism or queue here for resilience
      }

      // Update local state
      setProfile(prev => ({
        ...prev!,
        first_name: data.first_name || prev?.first_name,
        last_name: data.last_name || prev?.last_name
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

  const hasPermission = (permission: string) => {
    // Simple permission check based on profile roles
    // In a real app, you might check against a list of permissions from the backend
    return user !== null && (
      permission === 'manage_users' && profile?.role?.name === 'Admin'
    );
  };

  return {
    profile,
    setProfile,
    isProfileLoading,
    fetchBackendProfile,
    updateProfile,
    hasPermission
  };
};
