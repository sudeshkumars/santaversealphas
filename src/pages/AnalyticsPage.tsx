import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { regionalData, weeklyProduction, elfProductivity } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Download, FileText, Calendar } from 'lucide-react';

const AnalyticsPage = () => {
  const deliverySuccessData = [
    { week: 'W1', success: 100, failed: 0 },
    { week: 'W2', success: 100, failed: 0 },
    { week: 'W3', success: 99.8, failed: 0.2 },
    { week: 'W4', success: 99.5, failed: 0.5 },
  ];

  const categoryData = [
    { name: 'Toys', value: 35, color: 'hsl(0, 72%, 50%)' },
    { name: 'Electronics', value: 25, color: 'hsl(152, 60%, 35%)' },
    { name: 'Books', value: 15, color: 'hsl(42, 90%, 55%)' },
    { name: 'Sports', value: 12, color: 'hsl(200, 70%, 50%)' },
    { name: 'Creative', value: 8, color: 'hsl(280, 60%, 50%)' },
    { name: 'Other', value: 5, color: 'hsl(220, 20%, 50%)' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Analytics & Reporting
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Comprehensive insights into Christmas operations performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              This Week
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gifts by Region */}
          <GlassCard>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Gifts Distribution by Region
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis 
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <YAxis 
                    dataKey="name"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'hsl(220, 25%, 12%)',
                      border: '1px solid hsl(220, 20%, 20%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 20%, 95%)'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} gifts`, 'Total']}
                  />
                  <Bar dataKey="gifts" fill="url(#regionGradient)" radius={[0, 4, 4, 0]} />
                  <defs>
                    <linearGradient id="regionGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--christmas-red))" />
                      <stop offset="100%" stopColor="hsl(var(--christmas-green))" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Gift Categories */}
          <GlassCard>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Gift Categories Breakdown
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'hsl(220, 25%, 12%)',
                      border: '1px solid hsl(220, 20%, 20%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 20%, 95%)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Elf Productivity */}
          <GlassCard>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Elf Productivity by Department
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={elfProductivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="skill"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'hsl(220, 25%, 12%)',
                      border: '1px solid hsl(220, 20%, 20%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 20%, 95%)'
                    }}
                  />
                  <Bar dataKey="avgEfficiency" fill="hsl(var(--christmas-green))" radius={[4, 4, 0, 0]} name="Avg Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Delivery Success Trend */}
          <GlassCard>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Delivery Success Rate Trend
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={deliverySuccessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="week"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    domain={[95, 100]}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'hsl(220, 25%, 12%)',
                      border: '1px solid hsl(220, 20%, 20%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 20%, 95%)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="success" 
                    stroke="hsl(var(--christmas-green))" 
                    fill="hsl(var(--christmas-green)/0.2)"
                    name="Success Rate %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Quick Reports */}
        <GlassCard>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Available Reports
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Daily Operations Summary', date: 'Dec 25, 2024', type: 'Daily' },
              { title: 'Weekly Production Report', date: 'Dec 18-24, 2024', type: 'Weekly' },
              { title: 'Elf Performance Analysis', date: 'December 2024', type: 'Monthly' },
            ].map((report) => (
              <div 
                key={report.title}
                className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{report.title}</p>
                  <p className="text-xs text-muted-foreground">{report.date}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;
