import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminSettings {
  odds_api_key: string;
  polling_interval: string;
  auto_scan: string;
}

const DEFAULTS: AdminSettings = {
  odds_api_key: '',
  polling_interval: '30',
  auto_scan: 'false',
};

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from('admin_settings').select('key, value');
    if (data) {
      const mapped = { ...DEFAULTS };
      data.forEach((row: { key: string; value: string }) => {
        if (row.key in mapped) {
          (mapped as any)[row.key] = row.value;
        }
      });
      setSettings(mapped);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateSetting = useCallback(async (key: keyof AdminSettings, value: string) => {
    setIsSaving(true);
    await supabase
      .from('admin_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsSaving(false);
  }, []);

  return { settings, isLoading, isSaving, updateSetting, reload: load };
}
