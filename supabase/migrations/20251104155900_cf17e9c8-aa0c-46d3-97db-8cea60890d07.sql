-- Create brand_settings table
CREATE TABLE public.brand_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#000000',
  secondary_color TEXT NOT NULL DEFAULT '#666666',
  accent_color TEXT NOT NULL DEFAULT '#0066cc',
  font_family TEXT NOT NULL DEFAULT 'Inter',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own brand settings"
ON public.brand_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brand settings"
ON public.brand_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand settings"
ON public.brand_settings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand settings"
ON public.brand_settings FOR DELETE
USING (auth.uid() = user_id);

-- Add brand_settings_id to presentations
ALTER TABLE public.presentations 
ADD COLUMN brand_settings_id UUID REFERENCES public.brand_settings(id);

-- Create trigger for updated_at
CREATE TRIGGER update_brand_settings_updated_at
BEFORE UPDATE ON public.brand_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for brand assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true);

-- Storage policies for brand assets
CREATE POLICY "Users can view brand assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

CREATE POLICY "Users can upload their own brand assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own brand assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own brand assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);