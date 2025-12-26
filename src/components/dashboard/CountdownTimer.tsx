import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { useSettings } from '@/hooks/useSettings';

export function CountdownTimer() {
  const { data: settings } = useSettings();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      let targetDate: Date;
      
      if (settings?.countdown_target) {
        targetDate = new Date(settings.countdown_target);
      } else {
        // Default to Christmas if no settings
        targetDate = new Date(new Date().getFullYear(), 11, 25);
        const now = new Date();
        if (now > targetDate) {
          targetDate.setFullYear(targetDate.getFullYear() + 1);
        }
      }
      
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [settings?.countdown_target]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-muted/50 font-display text-2xl font-bold text-foreground shadow-inner md:h-20 md:w-20 md:text-3xl">
        <span className="animate-countdown-pulse">{String(value).padStart(2, '0')}</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/10 to-transparent" />
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground md:text-xs">
        {label}
      </span>
    </div>
  );

  return (
    <GlassCard className="relative overflow-hidden" glowColor="red">
      <div className="absolute right-4 top-4 text-4xl opacity-20">🎄</div>
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Countdown
      </h3>
      <div className="flex items-center justify-center gap-3 md:gap-4">
        <TimeBlock value={timeLeft.days} label="Days" />
        <span className="mb-6 text-2xl font-light text-muted-foreground">:</span>
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <span className="mb-6 text-2xl font-light text-muted-foreground">:</span>
        <TimeBlock value={timeLeft.minutes} label="Minutes" />
        <span className="mb-6 text-2xl font-light text-muted-foreground">:</span>
        <TimeBlock value={timeLeft.seconds} label="Seconds" />
      </div>
    </GlassCard>
  );
}
