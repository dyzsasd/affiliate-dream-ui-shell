import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MediaUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
  accept?: string;
  maxSizeInMB?: number;
  className?: string;
  organizationId?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onUpload,
  currentUrl,
  label = "Upload Image",
  accept = "image/*",
  maxSizeInMB = 5,
  className = "",
  organizationId
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeInMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload files');
        return;
      }

      // Create unique file name with user ID prefix for RLS policy
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${organizationId || 'general'}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('organization-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('organization-media')
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onUpload(publicUrl);
      toast.success('Image uploaded successfully');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (previewUrl && previewUrl.includes('supabase')) {
      try {
        // Extract file path from URL
        const url = new URL(previewUrl);
        const pathParts = url.pathname.split('/');
        const filePath = pathParts.slice(-3).join('/'); // Get user_id/org_id/filename part

        await supabase.storage
          .from('organization-media')
          .remove([filePath]);

        toast.success('Image removed successfully');
      } catch (error) {
        console.error('Remove error:', error);
        // Continue with removal even if storage deletion fails
      }
    }

    setPreviewUrl('');
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="media-upload">{label}</Label>
      
      <div className="border-2 border-dashed border-border rounded-lg p-4">
        {previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-48 mx-auto rounded-lg object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Image className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Choose Image'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              PNG, JPG, GIF up to {maxSizeInMB}MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        id="media-upload"
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};