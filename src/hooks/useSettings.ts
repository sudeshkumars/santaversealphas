import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface DbSettings {
  id: string;
  user_id: string;
  countdown_target: string;
  created_at: string;
  updated_at: string;
}

export function useSettings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as DbSettings | null;
    },
    enabled: !!user,
  });
}

export function useUpsertSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (settings: { countdown_target: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Check if settings exist
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .single();
      
      if (existing) {
        // Update
        const { data, error } = await supabase
          .from('settings')
          .update({ countdown_target: settings.countdown_target })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Insert
        const { data, error } = await supabase
          .from('settings')
          .insert({ ...settings, user_id: user.id })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({ title: 'Settings saved!' });
    },
    onError: (error) => {
      toast({ title: 'Failed to save settings', description: error.message, variant: 'destructive' });
    },
  });
}
