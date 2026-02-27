-- Additional SQL to run for Collections and Storage

-- Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on row level security and bypass
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections DISABLE ROW LEVEL SECURITY;

-- Add Collection FK to Products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL;

-- Enable Storage (Run via SQL or UI)
-- Requires creating a bucket named "product_images" in the Storage UI and making it Public.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product_images', 'product_images', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product_images');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product_images');
