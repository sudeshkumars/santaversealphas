import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAllUsersWithRoles, useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  Shield, 
  ShieldCheck, 
  UserCircle,
  Loader2,
  Crown
} from 'lucide-react';
import { useState } from 'react';

const UsersPage = () => {
  const { data: users, isLoading } = useAllUsersWithRoles();
  const { data: currentUserRole } = useUserRole();
  const queryClient = useQueryClient();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const toggleAdminRole = async (userId: string, currentRoles: string[]) => {
    setUpdatingUserId(userId);
    const isCurrentlyAdmin = currentRoles.includes('admin');
    
    try {
      if (isCurrentlyAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        
        if (error) throw error;
        toast({ title: 'Admin role removed' });
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
        
        if (error) throw error;
        toast({ title: 'Admin role granted' });
      }
      
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-role'] });
    } catch (error: any) {
      toast({ 
        title: 'Failed to update role', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (!currentUserRole?.isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-24">
          <GlassCard className="max-w-md text-center">
            <Shield className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need admin privileges to access this page.
            </p>
          </GlassCard>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage user accounts and role assignments
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
              <Crown className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {users?.filter(u => u.roles.includes('admin')).length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Admins</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
              <UserCircle className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {users?.filter(u => !u.roles.includes('admin')).length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Regular Users</p>
            </div>
          </GlassCard>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Users List */}
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Roles</th>
                  <th className="pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Joined</th>
                  <th className="pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {users?.map((user) => (
                  <tr key={user.id} className="group hover:bg-muted/30">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          {user.roles.includes('admin') ? '👑' : '👤'}
                        </div>
                        <div>
                          <p className="font-medium">{user.display_name || 'No name'}</p>
                          <p className="text-xs text-muted-foreground">{user.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        {user.roles.map((role: string) => (
                          <Badge 
                            key={role}
                            className={role === 'admin' ? 'badge-gold' : 'badge-nice'}
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <Button
                        size="sm"
                        variant={user.roles.includes('admin') ? 'outline' : 'default'}
                        onClick={() => toggleAdminRole(user.user_id, user.roles)}
                        disabled={updatingUserId === user.user_id}
                      >
                        {updatingUserId === user.user_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : user.roles.includes('admin') ? (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Make Admin
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!users || users.length === 0) && !isLoading && (
              <div className="py-12 text-center text-muted-foreground">
                No users found.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default UsersPage;
