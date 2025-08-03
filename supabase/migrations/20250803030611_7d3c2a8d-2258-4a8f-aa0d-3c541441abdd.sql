-- Create storage bucket for organization media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'organization-media',
  'organization-media',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
);

-- Create RLS policies for organization media storage
CREATE POLICY "Users can view organization media files"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'organization-media');

CREATE POLICY "Authenticated users can upload organization media files"
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'organization-media' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their organization media files"
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'organization-media' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their organization media files"
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'organization-media' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);