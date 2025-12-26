import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useCreateDelivery } from '@/hooks/useDeliveries';

export function AddDeliveryDialog() {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('Multiple');
  const [totalGifts, setTotalGifts] = useState('0');
  const [status, setStatus] = useState<'pending' | 'in_transit' | 'delivered'>('pending');
  const [weatherRisk, setWeatherRisk] = useState<'low' | 'medium' | 'high'>('low');
  const [timezone, setTimezone] = useState('UTC');

  const createDelivery = useCreateDelivery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createDelivery.mutateAsync({
      region,
      country,
      total_gifts: parseInt(totalGifts),
      delivered: 0,
      status,
      weather_risk: weatherRisk,
      timezone,
    });

    setRegion('');
    setCountry('Multiple');
    setTotalGifts('0');
    setStatus('pending');
    setWeatherRisk('low');
    setTimezone('UTC');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-secondary hover:bg-secondary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Route
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Add Delivery Route</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="North America"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Multiple"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total Gifts</Label>
              <Input
                type="number"
                min="0"
                value={totalGifts}
                onChange={(e) => setTotalGifts(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="UTC-5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Weather Risk</Label>
              <Select value={weatherRisk} onValueChange={(v) => setWeatherRisk(v as typeof weatherRisk)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">☀️ Low</SelectItem>
                  <SelectItem value="medium">☁️ Medium</SelectItem>
                  <SelectItem value="high">🌧️ High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createDelivery.isPending}>
            {createDelivery.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Delivery Route'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
