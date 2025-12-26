import { GlassCard } from '@/components/ui/glass-card';
import { Alert } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertIcons = {
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
  success: CheckCircle,
};

const alertColors = {
  warning: 'text-accent border-accent/30 bg-accent/10',
  danger: 'text-primary border-primary/30 bg-primary/10',
  info: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  success: 'text-secondary border-secondary/30 bg-secondary/10',
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const unreadAlerts = alerts.filter(a => !a.read);

  return (
    <GlassCard className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Smart Alerts
        </h3>
        {unreadAlerts.length > 0 && (
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
            {unreadAlerts.length} new
          </span>
        )}
      </div>
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
        {alerts.map((alert) => {
          const Icon = alertIcons[alert.type];
          return (
            <div
              key={alert.id}
              className={cn(
                'relative rounded-lg border p-3 transition-all duration-200 hover:scale-[1.02]',
                alertColors[alert.type],
                !alert.read && 'ring-1 ring-offset-1 ring-offset-background'
              )}
            >
              <div className="flex gap-3">
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{alert.title}</p>
                  <p className="mt-1 text-xs opacity-80 leading-relaxed">{alert.message}</p>
                  <p className="mt-2 text-[10px] opacity-60">{alert.timestamp}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 opacity-50 hover:opacity-100">
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {!alert.read && (
                <div className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-current" />
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
