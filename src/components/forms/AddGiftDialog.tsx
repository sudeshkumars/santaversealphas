import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useCreateGift } from '@/hooks/useGifts';

export function AddGiftDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Toys');
  const [stock, setStock] = useState('0');
  const [maxStock, setMaxStock] = useState('100');
  const [status, setStatus] = useState<'designing' | 'manufacturing' | 'packed' | 'ready'>('designing');
  const [demandLevel, setDemandLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [productionProgress, setProductionProgress] = useState('0');

  const createGift = useCreateGift();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createGift.mutateAsync({
      name,
      category,
      stock: parseInt(stock),
      max_stock: parseInt(maxStock),
      status,
      demand_level: demandLevel,
      production_progress: parseInt(productionProgress),
    });

    setName('');
    setCategory('Toys');
    setStock('0');
    setMaxStock('100');
    setStatus('designing');
    setDemandLevel('medium');
    setProductionProgress('0');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-secondary hover:bg-secondary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Gift
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Add Gift to Inventory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Gift Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lego Star Wars Set"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toys">Toys</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Creative">Creative</SelectItem>
                  <SelectItem value="Plush">Plush</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Current Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Max Stock</Label>
              <Input
                id="maxStock"
                type="number"
                min="1"
                value={maxStock}
                onChange={(e) => setMaxStock(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="designing">Designing</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Demand</Label>
              <Select value={demandLevel} onValueChange={(v) => setDemandLevel(v as typeof demandLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Progress %</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={productionProgress}
                onChange={(e) => setProductionProgress(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createGift.isPending}>
            {createGift.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Gift'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
