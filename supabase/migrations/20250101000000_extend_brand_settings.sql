-- Extend brand_settings table with new theme fields
ALTER TABLE public.brand_settings 
ADD COLUMN IF NOT EXISTS heading_font TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS body_font TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS type_scale JSONB,
ADD COLUMN IF NOT EXISTS palette_json JSONB;

-- Update existing rows to have defaults
UPDATE public.brand_settings
SET 
  heading_font = COALESCE(heading_font, font_family, 'Inter'),
  body_font = COALESCE(body_font, font_family, 'Inter')
WHERE heading_font IS NULL OR body_font IS NULL;

