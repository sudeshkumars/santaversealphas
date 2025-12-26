import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface ReadinessGaugeProps {
  percentage: number;
}

export function ReadinessGauge({ percentage }: ReadinessGaugeProps) {
  const getColor = (value: number) => {
    if (value >= 80) return 'text-secondary';
    if (value >= 60) return 'text-accent';
    return 'text-primary';
  };

  const getStatus = (value: number) => {
    if (value >= 90) return 'Excellent';
    if (value >= 80) return 'On Track';
    if (value >= 60) return 'Needs Attention';
    return 'Critical';
  };

  const strokeDasharray = 2 * Math.PI * 90;
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
    <GlassCard glowColor="gold">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Christmas Readiness Score
      </h3>
      <div className="relative flex items-center justify-center">
        <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--christmas-red))" />
              <stop offset="50%" stopColor="hsl(var(--christmas-gold))" />
              <stop offset="100%" stopColor="hsl(var(--christmas-green))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn('font-display text-4xl font-bold', getColor(percentage))}>
            {percentage}%
          </span>
          <span className="mt-1 text-sm text-muted-foreground">{getStatus(percentage)}</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="h-2 w-full rounded-full bg-primary/30" />
          <p className="mt-1 text-muted-foreground">Critical</p>
        </div>
        <div>
          <div className="h-2 w-full rounded-full bg-accent/30" />
          <p className="mt-1 text-muted-foreground">Warning</p>
        </div>
        <div>
          <div className="h-2 w-full rounded-full bg-secondary/30" />
          <p className="mt-1 text-muted-foreground">Optimal</p>
        </div>
      </div>
    </GlassCard>
  );
}
