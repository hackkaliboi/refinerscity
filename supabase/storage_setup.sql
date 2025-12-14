-- ============================================
-- STORAGE BUCKET SETUP
-- Run this in Supabase SQL Editor to create storage buckets and policies
-- ============================================

-- Create church-media bucket for images, videos, and other media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'church-media',
    'church-media',
    true,
    52428800, -- 50MB limit
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'application/pdf'
    ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Allow public to view all files
CREATE POLICY "Public can view all media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'church-media');

-- Allow anyone to upload files
CREATE POLICY "Anyone can upload media"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'church-media');

-- Allow anyone to update their uploads
CREATE POLICY "Anyone can update media"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'church-media');

-- Allow anyone to delete files
CREATE POLICY "Anyone can delete media"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'church-media');

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if bucket was created
SELECT * FROM storage.buckets WHERE id = 'church-media';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
