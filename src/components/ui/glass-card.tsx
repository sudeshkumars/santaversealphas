import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'red' | 'green' | 'gold' | 'none';
}

export function GlassCard({ children, className, glowColor = 'none' }: GlassCardProps) {
  return (
    <div 
      className={cn(
        'glass-card p-5 transition-all duration-300 hover:border-border',
        glowColor === 'red' && 'hover:shadow-[0_0_30px_hsl(var(--christmas-red)/0.2)]',
        glowColor === 'green' && 'hover:shadow-[0_0_30px_hsl(var(--christmas-green)/0.2)]',
        glowColor === 'gold' && 'hover:shadow-[0_0_30px_hsl(var(--christmas-gold)/0.2)]',
        className
      )}
    >
      {children}
    </div>
  );
}
