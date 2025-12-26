import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { useDeliveries, DbDelivery, useUpdateDelivery, useDeleteDelivery } from '@/hooks/useDeliveries';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddDeliveryDialog } from '@/components/forms/AddDeliveryDialog';
import { EditDeliveryDialog } from '@/components/forms/EditDeliveryDialog';
import { 
  CheckCircle,
  AlertTriangle,
  CloudRain,
  Sun,
  Cloud,
  MapPin,
  RefreshCw,
  Loader2,
  Trash2,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useDemoMode } from '@/contexts/DemoContext';
import { mockDeliveries } from '@/lib/mockData';

const DeliveriesPage = () => {
  useRealtimeSync();
  const { isDemoMode } = useDemoMode();
  const { data: dbDeliveries, isLoading } = useDeliveries();
  const updateDelivery = useUpdateDelivery();
  const deleteDelivery = useDeleteDelivery();

  // Use mock data in demo mode if no real data exists
  const deliveries = isDemoMode && (!dbDeliveries || dbDeliveries.length === 0)
    ? mockDeliveries.map(d => ({
        id: d.id,
        user_id: '',
        region: d.region,
        country: d.country,
        total_gifts: d.totalGifts,
        delivered: d.delivered,
        status: d.status,
        weather_risk: d.weatherRisk,
        timezone: d.timezone,
        created_at: '',
        updated_at: '',
      })) as DbDelivery[]
    : dbDeliveries || [];

  const getStatusColor = (status: DbDelivery['status']) => {
    switch (status) {
      case 'delivered': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'in_transit': return 'bg-accent/20 text-accent border-accent/30';
      case 'pending': return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getWeatherIcon = (risk: DbDelivery['weather_risk']) => {
    switch (risk) {
      case 'low': return <Sun className="h-4 w-4 text-secondary" />;
      case 'medium': return <Cloud className="h-4 w-4 text-accent" />;
      case 'high': return <CloudRain className="h-4 w-4 text-primary" />;
    }
  };

  const totalGifts = deliveries.reduce((sum, d) => sum + d.total_gifts, 0);
  const totalDelivered = deliveries.reduce((sum, d) => sum + d.delivered, 0);

  const handleStartDelivery = (delivery: DbDelivery) => {
    updateDelivery.mutate({ id: delivery.id, status: 'in_transit' });
  };

  const handleCompleteDelivery = (delivery: DbDelivery) => {
    updateDelivery.mutate({ id: delivery.id, status: 'delivered', delivered: delivery.total_gifts });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Global Delivery Command
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track deliveries, monitor routes, and manage logistics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <AddDeliveryDialog />
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Sleigh Status */}
        <GlassCard className="relative overflow-hidden" glowColor="gold">
          <div className="absolute right-6 top-6 text-6xl opacity-10">🛷</div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Sleigh Health Monitor
          </h3>
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Overall Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
                <span className="text-lg font-bold text-secondary">Optimal</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fuel (Magic Dust)</p>
              <div className="flex items-center gap-3 mt-1">
                <Progress value={92} className="flex-1" />
                <span className="font-bold">92%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Reindeer Energy</p>
              <div className="flex items-center gap-3 mt-1">
                <Progress value={88} className="flex-1" />
                <span className="font-bold">88%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Navigation System</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span className="font-medium">All Satellites Connected</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Global Progress */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Global Delivery Progress
            </h3>
            <Badge className="badge-gold">Christmas Eve</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-1000"
                  style={{ width: `${totalGifts > 0 ? (totalDelivered / totalGifts) * 100 : 0}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-bold">
              {totalGifts > 0 ? ((totalDelivered / totalGifts) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>{totalDelivered.toLocaleString()} delivered</span>
            <span>{totalGifts.toLocaleString()} total</span>
          </div>
        </GlassCard>

        {/* Region Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deliveries.map((delivery) => (
            <GlassCard 
              key={delivery.id}
              className="group"
              glowColor={delivery.status === 'delivered' ? 'green' : delivery.status === 'in_transit' ? 'gold' : 'none'}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{delivery.region}</h3>
                    <p className="text-xs text-muted-foreground">{delivery.timezone}</p>
                  </div>
                </div>
                <Badge className={cn('capitalize border', getStatusColor(delivery.status))}>
                  {delivery.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Delivery Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Delivery Progress</span>
                  <span className="font-medium">
                    {delivery.delivered.toLocaleString()} / {delivery.total_gifts.toLocaleString()}
                  </span>
                </div>
                <Progress value={delivery.total_gifts > 0 ? (delivery.delivered / delivery.total_gifts) * 100 : 0} />
              </div>

              {/* Weather Risk */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Weather Risk</span>
                <div className="flex items-center gap-2">
                  {getWeatherIcon(delivery.weather_risk)}
                  <span className={cn(
                    'text-sm capitalize font-medium',
                    delivery.weather_risk === 'low' ? 'text-secondary' :
                    delivery.weather_risk === 'medium' ? 'text-accent' : 'text-primary'
                  )}>
                    {delivery.weather_risk}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <EditDeliveryDialog delivery={delivery} />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteDelivery.mutate(delivery.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {delivery.status === 'pending' && (
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleStartDelivery(delivery)}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Start Delivery
                  </Button>
                )}
                {delivery.status === 'in_transit' && (
                  <Button 
                    size="sm" 
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                    onClick={() => handleCompleteDelivery(delivery)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Complete
                  </Button>
                )}
              </div>

              {delivery.weather_risk === 'high' && delivery.status !== 'delivered' && (
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                    <AlertTriangle className="mr-2 h-3 w-3" />
                    Emergency Reroute
                  </Button>
                </div>
              )}
            </GlassCard>
          ))}
        </div>

        {deliveries.length === 0 && !isLoading && (
          <GlassCard className="py-12 text-center">
            <p className="text-muted-foreground">No delivery routes configured. Add some to start tracking!</p>
          </GlassCard>
        )}

        {/* Animated Sleigh Route */}
        <GlassCard>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Live Sleigh Route Visualization
          </h3>
          <div className="relative h-32 overflow-hidden rounded-lg bg-muted/50">
            <div className="absolute inset-0 flex items-center">
              {/* Route Line */}
              <div className="h-0.5 w-full bg-gradient-to-r from-primary via-accent to-secondary opacity-30" />
              
              {/* Waypoints */}
              {['🏔️', '🌲', '🏠', '🌆', '🏝️'].map((emoji, i) => (
                <div 
                  key={i}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${(i + 1) * 16}%` }}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className={cn(
                    'h-3 w-3 rounded-full border-2 border-background',
                    i < 2 ? 'bg-secondary' : 'bg-muted-foreground'
                  )} />
                </div>
              ))}
              
              {/* Animated Sleigh */}
              <div 
                className="absolute text-3xl animate-float"
                style={{ left: '30%' }}
              >
                🛷
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Currently over: <span className="font-medium text-foreground">North Atlantic</span> • 
            ETA to next stop: <span className="font-medium text-accent">2h 34m</span>
          </p>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default DeliveriesPage;
