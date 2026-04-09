
CREATE TABLE public.admin_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
ON public.admin_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can update settings"
ON public.admin_settings FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can insert settings"
ON public.admin_settings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Insert default settings
INSERT INTO public.admin_settings (key, value) VALUES
  ('odds_api_key', ''),
  ('polling_interval', '30'),
  ('auto_scan', 'false');
