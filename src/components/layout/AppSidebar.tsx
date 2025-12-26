import { 
  LayoutDashboard, 
  Users, 
  Gift, 
  UserCircle, 
  Truck, 
  Brain, 
  BarChart3, 
  Settings,
  Sparkles,
  Shield,
  Snowflake
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useDemoMode } from '@/contexts/DemoContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Switch } from '@/components/ui/switch';

const navItems = [
  { title: 'Command Center', url: '/', icon: LayoutDashboard },
  { title: 'Children & Wishlists', url: '/children', icon: Users },
  { title: 'Gift Inventory', url: '/inventory', icon: Gift },
  { title: 'Elf Management', url: '/elves', icon: UserCircle },
  { title: 'Delivery Command', url: '/deliveries', icon: Truck },
  { title: 'AI Engine', url: '/ai-engine', icon: Brain },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
];

const adminNavItems = [
  { title: 'User Management', url: '/users', icon: Shield },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const { data: roleData } = useUserRole();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
            <Snowflake className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">Santa Verse</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">V1</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/15 text-primary shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                <span>{item.title}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-sm" 
                       style={{ boxShadow: '0 0 8px hsl(var(--primary))' }} />
                )}
              </NavLink>
            );
          })}

          {/* Admin-only nav items */}
          {roleData?.isAdmin && (
            <>
              <div className="my-3 border-t border-border/50 pt-3">
                <p className="mb-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Admin
                </p>
              </div>
              {adminNavItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/15 text-primary shadow-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <item.icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                    <span>{item.title}</span>
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-sm" 
                           style={{ boxShadow: '0 0 8px hsl(var(--primary))' }} />
                    )}
                  </NavLink>
                );
              })}
            </>
          )}
        </nav>

        {/* Demo Mode Toggle */}
        <div className="border-t border-border/50 p-4">
          <div className="glass-card rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium">Demo Mode</span>
              </div>
              <Switch 
                checked={isDemoMode} 
                onCheckedChange={toggleDemoMode}
                className="data-[state=checked]:bg-accent"
              />
            </div>
            {isDemoMode && (
              <p className="mt-2 text-[10px] text-muted-foreground">
                Sample data loaded for demonstration
              </p>
            )}
          </div>
        </div>

      </div>
    </aside>
  );
}
