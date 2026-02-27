-- SCHEMA SETUP FOR SIMPLIFIRE

-- Setup Custom Types
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE order_status AS ENUM ('make it to proceed', 'active order', 'delivered');

-- Update Auth Users
-- We will use the built-in Supabase auth.users and extend it with a profile table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role DEFAULT 'customer',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on row level security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  variations JSONB, -- Optional variations e.g., [{"color": "red", "size": "M"}]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on row level security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  status order_status DEFAULT 'make it to proceed',
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on row level security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  selected_variation JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on row level security
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Analytics Views or Functions (Optional, for admin dashboard)
-- Example: total revenue, total products
