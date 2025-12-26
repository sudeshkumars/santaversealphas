import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Loader2 } from 'lucide-react';
import { useUpdateChild, DbChild } from '@/hooks/useChildren';

interface EditChildDialogProps {
  child: DbChild;
}

export function EditChildDialog({ child }: EditChildDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(child.age.toString());
  const [country, setCountry] = useState(child.country);
  const [region, setRegion] = useState(child.region);
  const [behaviorScore, setBehaviorScore] = useState(child.behavior_score.toString());
  const [status, setStatus] = useState<string>(child.status);

  const updateChild = useUpdateChild();

  useEffect(() => {
    if (open) {
      setName(child.name);
      setAge(child.age.toString());
      setCountry(child.country);
      setRegion(child.region);
      setBehaviorScore(child.behavior_score.toString());
      setStatus(child.status);
    }
  }, [open, child]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateChild.mutateAsync({
      id: child.id,
      name,
      age: parseInt(age),
      country,
      region,
      behavior_score: parseInt(behaviorScore),
      status: status as 'nice' | 'naughty' | 'pending',
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
          <DialogTitle className="font-display">Edit Child</DialogTitle>
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
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="18"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Behavior Score</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={behaviorScore}
                onChange={(e) => setBehaviorScore(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nice">Nice</SelectItem>
                  <SelectItem value="naughty">Naughty</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={updateChild.isPending}>
            {updateChild.isPending ? (
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
