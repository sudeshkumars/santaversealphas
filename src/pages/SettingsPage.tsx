import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  User,
  Bell,
  Palette,
  Globe,
  Shield,
  Moon,
  Sun,
  CalendarIcon,
  Loader2,
  Timer
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useSettings, useUpsertSettings } from '@/hooks/useSettings';

const SettingsPage = () => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'classic'>('dark');
  const [notifications, setNotifications] = useState({
    alerts: true,
    production: true,
    deliveries: true,
    sounds: false,
  });
  const [countdownDate, setCountdownDate] = useState<Date | undefined>(new Date('2025-12-25'));
  
  const { data: settings, isLoading } = useSettings();
  const upsertSettings = useUpsertSettings();
  
  useEffect(() => {
    if (settings?.countdown_target) {
      setCountdownDate(new Date(settings.countdown_target));
    }
  }, [settings]);
  
  const handleSaveCountdown = () => {
    if (countdownDate) {
      upsertSettings.mutate({ countdown_target: countdownDate.toISOString() });
    }
  };

  const themes = [
    { id: 'dark', name: 'Dark North Pole', icon: Moon, colors: ['#0f1419', '#1a2332', '#2d3748'] },
    { id: 'light', name: 'Classic Christmas', icon: Sun, colors: ['#ffffff', '#f8f9fa', '#e9ecef'] },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Settings & Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure SantaVerse OS preferences and system settings
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Countdown Target */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <Timer className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Countdown Target</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Set the target date for the dashboard countdown timer.
              </p>
              <div className="flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !countdownDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {countdownDate ? format(countdownDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={countdownDate}
                      onSelect={setCountdownDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <Button 
                  onClick={handleSaveCountdown} 
                  disabled={upsertSettings.isPending}
                >
                  {upsertSettings.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
              {settings && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Currently set to: {format(new Date(settings.countdown_target), "PPP")}
                </p>
              )}
            </GlassCard>

            {/* User Profile */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">User Profile</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-4xl">
                  🎅
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold">Santa Claus</h4>
                  <p className="text-sm text-muted-foreground">santa@northpole.com</p>
                  <Badge className="mt-2 badge-gold">Administrator</Badge>
                </div>
                <Button variant="outline">Edit Profile</Button>
              </div>
            </GlassCard>

            {/* Theme Selection */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <Palette className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Theme</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id as 'dark' | 'light');
                      document.documentElement.classList.toggle('light', t.id === 'light');
                    }}
                    className={cn(
                      'flex items-center gap-4 rounded-lg border-2 p-4 transition-all',
                      theme === t.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-border/80'
                    )}
                  >
                    <t.icon className={cn('h-6 w-6', theme === t.id && 'text-primary')} />
                    <div className="text-left flex-1">
                      <p className="font-medium">{t.name}</p>
                      <div className="mt-2 flex gap-1">
                        {t.colors.map((color, i) => (
                          <div 
                            key={i}
                            className="h-4 w-8 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    {theme === t.id && (
                      <div className="h-4 w-4 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Notifications */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'alerts', label: 'Smart Alerts', description: 'Receive critical system notifications' },
                  { key: 'production', label: 'Production Updates', description: 'Updates on gift manufacturing' },
                  { key: 'deliveries', label: 'Delivery Status', description: 'Real-time delivery notifications' },
                  { key: 'sounds', label: 'Sound Effects', description: 'Play sounds for notifications' },
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">{setting.label}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <Switch 
                      checked={notifications[setting.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [setting.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Language */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Language & Region</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-muted-foreground">Language</label>
                  <select className="mt-1 w-full rounded-lg border border-border bg-muted p-2">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Japanese</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Time Zone</label>
                  <select className="mt-1 w-full rounded-lg border border-border bg-muted p-2">
                    <option>North Pole Standard Time (NPST)</option>
                    <option>UTC</option>
                    <option>EST</option>
                    <option>PST</option>
                  </select>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                * Language selector is a mock feature for demonstration
              </p>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Role Access */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Role Access</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎅</span>
                    <div>
                      <p className="font-medium">Santa</p>
                      <p className="text-xs text-muted-foreground">Full access</p>
                    </div>
                  </div>
                  <Badge className="badge-gold">Active</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧝</span>
                    <div>
                      <p className="font-medium">Head Elf</p>
                      <p className="text-xs text-muted-foreground">Limited access</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Switch</Button>
                </div>
              </div>
            </GlassCard>

            {/* Accessibility */}
            <GlassCard>
              <h3 className="font-display text-lg font-semibold mb-4">Accessibility</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reduce Motion</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">High Contrast</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Large Text</span>
                  <Switch />
                </div>
              </div>
            </GlassCard>

            {/* System Info */}
            <GlassCard>
              <h3 className="font-display text-lg font-semibold mb-4">System Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span>2025.12.25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Build</span>
                  <span>North Pole Edition</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-secondary">Operational</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
