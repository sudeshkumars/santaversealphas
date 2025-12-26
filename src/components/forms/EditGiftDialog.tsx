import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Loader2 } from 'lucide-react';
import { useUpdateGift, DbGift } from '@/hooks/useGifts';

interface EditGiftDialogProps {
  gift: DbGift;
}

export function EditGiftDialog({ gift }: EditGiftDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(gift.name);
  const [category, setCategory] = useState(gift.category);
  const [stock, setStock] = useState(gift.stock.toString());
  const [maxStock, setMaxStock] = useState(gift.max_stock.toString());
  const [status, setStatus] = useState<string>(gift.status);
  const [demandLevel, setDemandLevel] = useState<string>(gift.demand_level);
  const [productionProgress, setProductionProgress] = useState(gift.production_progress.toString());

  const updateGift = useUpdateGift();

  useEffect(() => {
    if (open) {
      setName(gift.name);
      setCategory(gift.category);
      setStock(gift.stock.toString());
      setMaxStock(gift.max_stock.toString());
      setStatus(gift.status);
      setDemandLevel(gift.demand_level);
      setProductionProgress(gift.production_progress.toString());
    }
  }, [open, gift]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateGift.mutateAsync({
      id: gift.id,
      name,
      category,
      stock: parseInt(stock),
      max_stock: parseInt(maxStock),
      status: status as DbGift['status'],
      demand_level: demandLevel as DbGift['demand_level'],
      production_progress: parseInt(productionProgress),
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Gift</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Current Stock</Label>
              <Input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Max Stock</Label>
              <Input
                type="number"
                min="1"
                value={maxStock}
                onChange={(e) => setMaxStock(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="designing">Designing</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Demand Level</Label>
              <Select value={demandLevel} onValueChange={setDemandLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Production Progress (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={productionProgress}
              onChange={(e) => setProductionProgress(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={updateGift.isPending}>
            {updateGift.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
