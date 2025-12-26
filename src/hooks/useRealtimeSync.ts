import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'children' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['children'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wishlist_items' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['children'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gifts' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['gifts'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'elves' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['elves'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deliveries' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['deliveries'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}
