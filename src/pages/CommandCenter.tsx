import { MainLayout } from '@/components/layout/MainLayout';
import { CountdownTimer } from '@/components/dashboard/CountdownTimer';
import { StatCard } from '@/components/dashboard/StatCard';
import { NaughtyNiceChart } from '@/components/dashboard/NaughtyNiceChart';
import { ReadinessGauge } from '@/components/dashboard/ReadinessGauge';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { dashboardStats, mockAlerts, weeklyProduction } from '@/lib/mockData';
import { 
  Users, 
  Heart, 
  Gift, 
  Truck, 
  UserCheck,
  Sparkles 
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CommandCenter = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Command Center
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time overview of global Christmas operations
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-secondary">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <CountdownTimer />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            title="Total Children"
            value={dashboardStats.totalChildren}
            subtitle="Registered worldwide"
            icon={Users}
            glowColor="gold"
            iconColor="text-accent"
            trend={{ value: 3.2, isPositive: true }}
          />
          <StatCard
            title="Wishes Approved"
            value={dashboardStats.wishesApproved}
            subtitle="Ready for production"
            icon={Heart}
            glowColor="red"
            iconColor="text-primary"
            trend={{ value: 5.8, isPositive: true }}
          />
          <StatCard
            title="In Production"
            value={dashboardStats.giftsInProduction}
            subtitle="Currently manufacturing"
            icon={Gift}
            glowColor="green"
            iconColor="text-secondary"
          />
          <StatCard
            title="Delivered"
            value={dashboardStats.deliveriesCompleted}
            subtitle="Christmas Eve countdown"
            icon={Truck}
            iconColor="text-muted-foreground"
          />
          <StatCard
            title="Active Elves"
            value={dashboardStats.activeElves}
            subtitle="Working across shifts"
            icon={UserCheck}
            glowColor="green"
            iconColor="text-secondary"
            trend={{ value: 2.1, isPositive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <NaughtyNiceChart 
            nicePercentage={dashboardStats.nicePercentage} 
            naughtyPercentage={dashboardStats.naughtyPercentage} 
          />
          <ReadinessGauge percentage={dashboardStats.christmasReadiness} />
          <AlertsPanel alerts={mockAlerts} />
        </div>

        {/* Production Chart */}
        <GlassCard>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Weekly Production Overview
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProduction} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(220, 25%, 12%)',
                    border: '1px solid hsl(220, 20%, 20%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 20%, 95%)'
                  }}
                  formatter={(value: number, name: string) => [
                    `${(value / 1000000).toFixed(1)}M gifts`,
                    name === 'produced' ? 'Produced' : 'Target'
                  ]}
                />
                <Bar 
                  dataKey="target" 
                  fill="hsl(var(--muted))" 
                  radius={[4, 4, 0, 0]}
                  name="Target"
                />
                <Bar 
                  dataKey="produced" 
                  fill="url(#productionGradient)" 
                  radius={[4, 4, 0, 0]}
                  name="Produced"
                />
                <defs>
                  <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--christmas-green))" />
                    <stop offset="100%" stopColor="hsl(var(--christmas-green)/0.6)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default CommandCenter;
