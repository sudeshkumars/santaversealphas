import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface DbChild {
  id: string;
  user_id: string;
  name: string;
  age: number;
  country: string;
  region: string;
  behavior_score: number;
  status: 'nice' | 'naughty' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface DbWishlistItem {
  id: string;
  child_id: string;
  user_id: string;
  name: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  age_appropriate: boolean;
  in_stock: boolean;
  created_at: string;
}

export function useChildren() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['children', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DbChild[];
    },
    enabled: !!user,
  });
}

export function useChildWithWishlist(childId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['child', childId],
    queryFn: async () => {
      if (!user || !childId) return null;
      
      const { data: child, error: childError } = await supabase
        .from('children')
        .select('*')
        .eq('id', childId)
        .maybeSingle();
      
      if (childError) throw childError;
      if (!child) return null;
      
      const { data: wishlist, error: wishlistError } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('child_id', childId);
      
      if (wishlistError) throw wishlistError;
      
      return { child: child as DbChild, wishlist: wishlist as DbWishlistItem[] };
    },
    enabled: !!user && !!childId,
  });
}

export function useCreateChild() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (child: Omit<DbChild, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('children')
        .insert({ ...child, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast({ title: 'Child added successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Failed to add child', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbChild> & { id: string }) => {
      const { data, error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast({ title: 'Child updated!' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast({ title: 'Child removed' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
    },
  });
}

export function useCreateWishlistItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (item: Omit<DbWishlistItem, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert({ ...item, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['child', data.child_id] });
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast({ title: 'Wishlist item added!' });
    },
    onError: (error) => {
      toast({ title: 'Failed to add item', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateWishlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbWishlistItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('wishlist_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['child', data.child_id] });
      toast({ title: 'Wishlist item updated!' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update', description: error.message, variant: 'destructive' });
    },
  });
}
