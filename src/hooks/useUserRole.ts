import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'admin' | 'user';

export function useUserRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const roles = data?.map(r => r.role as AppRole) || [];
      const isAdmin = roles.includes('admin');
      
      return { roles, isAdmin };
    },
    enabled: !!user,
  });
}

export function useAllUsersWithRoles() {
  const { user } = useAuth();
  const { data: roleData } = useUserRole();

  return useQuery({
    queryKey: ['all-users-roles'],
    queryFn: async () => {
      // This requires admin access - query profiles and roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // Combine profiles with their roles
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.user_id).map(r => r.role) || [],
      })) || [];
      
      return usersWithRoles;
    },
    enabled: !!user && roleData?.isAdmin === true,
  });
}
