-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for auto-creating profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Children table
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 0 AND age <= 18),
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  behavior_score INTEGER NOT NULL DEFAULT 50 CHECK (behavior_score >= 0 AND behavior_score <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('nice', 'naughty', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own children"
ON public.children FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert children"
ON public.children FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own children"
ON public.children FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own children"
ON public.children FOR DELETE
USING (auth.uid() = user_id);

-- Wishlist items table
CREATE TABLE public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'modified')),
  age_appropriate BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their wishlist items"
ON public.wishlist_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert wishlist items"
ON public.wishlist_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their wishlist items"
ON public.wishlist_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their wishlist items"
ON public.wishlist_items FOR DELETE
USING (auth.uid() = user_id);

-- Gifts inventory table
CREATE TABLE public.gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  max_stock INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'designing' CHECK (status IN ('designing', 'manufacturing', 'packed', 'ready')),
  demand_level TEXT NOT NULL DEFAULT 'medium' CHECK (demand_level IN ('high', 'medium', 'low')),
  production_progress INTEGER NOT NULL DEFAULT 0 CHECK (production_progress >= 0 AND production_progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their gifts"
ON public.gifts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert gifts"
ON public.gifts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their gifts"
ON public.gifts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their gifts"
ON public.gifts FOR DELETE
USING (auth.uid() = user_id);

-- Elves table
CREATE TABLE public.elves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  skill TEXT NOT NULL CHECK (skill IN ('toymaker', 'wrapper', 'logistics', 'quality', 'tech')),
  energy_level INTEGER NOT NULL DEFAULT 100 CHECK (energy_level >= 0 AND energy_level <= 100),
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  current_task TEXT,
  morale TEXT NOT NULL DEFAULT 'good' CHECK (morale IN ('excellent', 'good', 'tired', 'exhausted')),
  efficiency INTEGER NOT NULL DEFAULT 80 CHECK (efficiency >= 0 AND efficiency <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.elves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their elves"
ON public.elves FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert elves"
ON public.elves FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their elves"
ON public.elves FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their elves"
ON public.elves FOR DELETE
USING (auth.uid() = user_id);

-- Tasks table for elf task management
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  elf_id UUID REFERENCES public.elves(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their tasks"
ON public.tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert tasks"
ON public.tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their tasks"
ON public.tasks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their tasks"
ON public.tasks FOR DELETE
USING (auth.uid() = user_id);

-- Deliveries table
CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Multiple',
  total_gifts INTEGER NOT NULL DEFAULT 0,
  delivered INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered')),
  weather_risk TEXT NOT NULL DEFAULT 'low' CHECK (weather_risk IN ('low', 'medium', 'high')),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their deliveries"
ON public.deliveries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert deliveries"
ON public.deliveries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their deliveries"
ON public.deliveries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their deliveries"
ON public.deliveries FOR DELETE
USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gifts_updated_at
  BEFORE UPDATE ON public.gifts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_elves_updated_at
  BEFORE UPDATE ON public.elves
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at
  BEFORE UPDATE ON public.deliveries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();