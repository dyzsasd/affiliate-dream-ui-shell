-- Remove all storage policies for organization-media bucket
DROP POLICY IF EXISTS "Users can view organization media" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload organization media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their organization media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their organization media" ON storage.objects;