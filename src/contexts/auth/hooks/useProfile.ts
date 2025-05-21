
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types/auth';
import { UserProfile } from '../authTypes';
import { ProfileApi } from '@/generated-api/src/apis/ProfileApi';
import { createApiClient } from '@/services/backendApi';

export const useProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const { toast } = useToast();

  const fetchBackendProfile = async () => {
    try {
      const profileApi = await createApiClient(ProfileApi);
      const response = await profileApi.usersMeGet();
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

      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        }
      });

      if (error) {
        throw error;
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
    // Simple permission check
    // In a real app, you might check against a list of permissions
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
