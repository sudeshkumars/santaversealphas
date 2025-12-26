import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Loader2 } from 'lucide-react';
import { useUpdateDelivery, DbDelivery } from '@/hooks/useDeliveries';

interface EditDeliveryDialogProps {
  delivery: DbDelivery;
}

export function EditDeliveryDialog({ delivery }: EditDeliveryDialogProps) {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(delivery.region);
  const [country, setCountry] = useState(delivery.country);
  const [totalGifts, setTotalGifts] = useState(delivery.total_gifts.toString());
  const [delivered, setDelivered] = useState(delivery.delivered.toString());
  const [status, setStatus] = useState<string>(delivery.status);
  const [weatherRisk, setWeatherRisk] = useState<string>(delivery.weather_risk);
  const [timezone, setTimezone] = useState(delivery.timezone);

  const updateDelivery = useUpdateDelivery();

  useEffect(() => {
    if (open) {
      setRegion(delivery.region);
      setCountry(delivery.country);
      setTotalGifts(delivery.total_gifts.toString());
      setDelivered(delivery.delivered.toString());
      setStatus(delivery.status);
      setWeatherRisk(delivery.weather_risk);
      setTimezone(delivery.timezone);
    }
  }, [open, delivery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateDelivery.mutateAsync({
      id: delivery.id,
      region,
      country,
      total_gifts: parseInt(totalGifts),
      delivered: parseInt(delivered),
      status: status as DbDelivery['status'],
      weather_risk: weatherRisk as DbDelivery['weather_risk'],
      timezone,
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
          <DialogTitle className="font-display">Edit Delivery Route</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
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
              <Label>Delivered</Label>
              <Input
                type="number"
                min="0"
                value={delivered}
                onChange={(e) => setDelivered(e.target.value)}
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Weather Risk</Label>
              <Select value={weatherRisk} onValueChange={setWeatherRisk}>
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

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="UTC-5"
            />
          </div>

          <Button type="submit" className="w-full" disabled={updateDelivery.isPending}>
            {updateDelivery.isPending ? (
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
