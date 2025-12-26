import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface DbGift {
  id: string;
  user_id: string;
  name: string;
  category: string;
  stock: number;
  max_stock: number;
  status: 'designing' | 'manufacturing' | 'packed' | 'ready';
  demand_level: 'high' | 'medium' | 'low';
  production_progress: number;
  created_at: string;
  updated_at: string;
}

export function useGifts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['gifts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DbGift[];
    },
    enabled: !!user,
  });
}

export function useCreateGift() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (gift: Omit<DbGift, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('gifts')
        .insert({ ...gift, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      toast({ title: 'Gift added to inventory!' });
    },
    onError: (error) => {
      toast({ title: 'Failed to add gift', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbGift> & { id: string }) => {
      const { data, error } = await supabase
        .from('gifts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      toast({ title: 'Gift updated!' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      toast({ title: 'Gift removed from inventory' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
    },
  });
}
