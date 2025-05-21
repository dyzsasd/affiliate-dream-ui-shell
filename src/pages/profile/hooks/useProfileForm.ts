
import { useState, useEffect } from 'react';
import { UserProfile } from '@/contexts/auth/authTypes';

interface ProfileFormData {
  firstName: string;
  lastName: string;
}

interface UseProfileFormProps {
  profile: UserProfile | null;
  updateProfile: (data: { first_name?: string; last_name?: string }) => Promise<void>;
}

export const useProfileForm = ({ profile, updateProfile }: UseProfileFormProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
      });
    }
  }, [profile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditingProfile,
    setIsEditingProfile,
    isSaving,
    formData,
    handleChange,
    handleSubmit
  };
};
