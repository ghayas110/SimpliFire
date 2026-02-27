-- DEMO RLS POLICIES FOR SIMPLIFIRE
-- Run this in your Supabase SQL Editor to allow the application to read and write to the tables.

-- We temporarily disable RLS for a smoother demo workflow, or we can use fully permissive policies.
-- Let's use permissive policies for the demo so that frontend calls work flawlessly.

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
