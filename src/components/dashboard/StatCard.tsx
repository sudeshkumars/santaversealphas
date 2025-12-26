import { LucideIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  glowColor?: 'red' | 'green' | 'gold' | 'none';
  iconColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  glowColor = 'none',
  iconColor = 'text-primary'
}: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1_000_000_000) {
        return `${(val / 1_000_000_000).toFixed(1)}B`;
      }
      if (val >= 1_000_000) {
        return `${(val / 1_000_000).toFixed(1)}M`;
      }
      if (val >= 1_000) {
        return `${(val / 1_000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <GlassCard glowColor={glowColor} className="group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              trend.isPositive ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 transition-transform duration-300 group-hover:scale-110',
          iconColor
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </GlassCard>
  );
}
