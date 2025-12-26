import { GlassCard } from '@/components/ui/glass-card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NaughtyNiceChartProps {
  nicePercentage: number;
  naughtyPercentage: number;
}

export function NaughtyNiceChart({ nicePercentage, naughtyPercentage }: NaughtyNiceChartProps) {
  const data = [
    { name: 'Nice', value: nicePercentage, color: 'hsl(152, 60%, 35%)' },
    { name: 'Naughty', value: naughtyPercentage, color: 'hsl(0, 72%, 50%)' },
  ];

  return (
    <GlassCard glowColor="green">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Naughty vs Nice Distribution
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center gap-6">
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-secondary">{nicePercentage}%</p>
          <p className="text-xs text-muted-foreground">Nice Children</p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-primary">{naughtyPercentage}%</p>
          <p className="text-xs text-muted-foreground">Naughty Children</p>
        </div>
      </div>
    </GlassCard>
  );
}
