import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { useGifts, DbGift, useDeleteGift, useUpdateGift } from '@/hooks/useGifts';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddGiftDialog } from '@/components/forms/AddGiftDialog';
import { EditGiftDialog } from '@/components/forms/EditGiftDialog';
import { 
  Search, 
  Package, 
  AlertTriangle,
  TrendingUp,
  Factory,
  CheckCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { useDemoMode } from '@/contexts/DemoContext';
import { mockGifts } from '@/lib/mockData';

const InventoryPage = () => {
  useRealtimeSync();
  const [searchTerm, setSearchTerm] = useState('');
  const { isDemoMode } = useDemoMode();
  const { data: dbGifts, isLoading } = useGifts();
  const deleteGift = useDeleteGift();
  const updateGift = useUpdateGift();

  // Use mock data in demo mode if no real data exists
  const gifts = isDemoMode && (!dbGifts || dbGifts.length === 0)
    ? mockGifts.map(g => ({
        id: g.id,
        user_id: '',
        name: g.name,
        category: g.category,
        stock: g.stock,
        max_stock: g.maxStock,
        status: g.status,
        demand_level: g.demandLevel,
        production_progress: g.productionProgress,
        created_at: '',
        updated_at: '',
      })) as DbGift[]
    : dbGifts || [];

  const filteredGifts = gifts.filter(gift => 
    gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gift.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockGifts = gifts.filter(g => (g.stock / g.max_stock) < 0.3);
  const readyGifts = gifts.filter(g => g.status === 'ready');
  const inProductionGifts = gifts.filter(g => g.status === 'manufacturing');

  const getStatusColor = (status: DbGift['status']) => {
    switch (status) {
      case 'ready': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'packed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'manufacturing': return 'bg-accent/20 text-accent border-accent/30';
      case 'designing': return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getStockColor = (stock: number, maxStock: number) => {
    const percentage = (stock / maxStock) * 100;
    if (percentage >= 70) return 'bg-secondary';
    if (percentage >= 30) return 'bg-accent';
    return 'bg-primary';
  };

  const handleProgressUpdate = (gift: DbGift) => {
    const newProgress = Math.min(100, gift.production_progress + 10);
    const newStatus = newProgress === 100 ? 'ready' : gift.status;
    updateGift.mutate({ id: gift.id, production_progress: newProgress, status: newStatus as DbGift['status'] });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Gift Inventory & Factory
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track production status, stock levels, and manufacturing progress
            </p>
          </div>
          <AddGiftDialog />
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowStockGifts.length}</p>
              <p className="text-xs text-muted-foreground">Low Stock Items</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
              <Factory className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProductionGifts.length}</p>
              <p className="text-xs text-muted-foreground">In Production</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
              <CheckCircle className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{readyGifts.length}</p>
              <p className="text-xs text-muted-foreground">Ready to Ship</p>
            </div>
          </GlassCard>
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{gifts.length}</p>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </div>
          </GlassCard>
        </div>

        {/* Search */}
        <GlassCard>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search gifts by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </GlassCard>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Inventory Table */}
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Gift</th>
                  <th className="pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Stock Level</th>
                  <th className="pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Production</th>
                  <th className="pb-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredGifts.map((gift) => (
                  <tr key={gift.id} className="group hover:bg-muted/30">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{gift.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline">{gift.category}</Badge>
                    </td>
                    <td className="py-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{gift.stock.toLocaleString()}</span>
                          <span className="text-muted-foreground">/ {gift.max_stock.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div 
                            className={cn('h-full rounded-full', getStockColor(gift.stock, gift.max_stock))}
                            style={{ width: `${(gift.stock / gift.max_stock) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge className={cn('capitalize border', getStatusColor(gift.status))}>
                        {gift.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Progress value={gift.production_progress} className="w-20" />
                        <span className="text-sm text-muted-foreground">{gift.production_progress}%</span>
                        {gift.production_progress < 100 && (
                          <Button size="sm" variant="ghost" onClick={() => handleProgressUpdate(gift)}>
                            +10%
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-1">
                        <EditGiftDialog gift={gift} />
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deleteGift.mutate(gift.id)}
                          disabled={deleteGift.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredGifts.length === 0 && !isLoading && (
              <div className="py-12 text-center text-muted-foreground">
                No gifts found. Add some to your inventory!
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default InventoryPage;
