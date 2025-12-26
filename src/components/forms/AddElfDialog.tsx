import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useCreateElf } from '@/hooks/useElves';

export function AddElfDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [skill, setSkill] = useState<'toymaker' | 'wrapper' | 'logistics' | 'quality' | 'tech'>('toymaker');
  const [energyLevel, setEnergyLevel] = useState('100');
  const [efficiency, setEfficiency] = useState('80');
  const [morale, setMorale] = useState<'excellent' | 'good' | 'tired' | 'exhausted'>('good');

  const createElf = useCreateElf();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createElf.mutateAsync({
      name,
      skill,
      energy_level: parseInt(energyLevel),
      tasks_completed: 0,
      current_task: null,
      morale,
      efficiency: parseInt(efficiency),
    });

    setName('');
    setSkill('toymaker');
    setEnergyLevel('100');
    setEfficiency('80');
    setMorale('good');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-secondary hover:bg-secondary/90">
          <Plus className="mr-2 h-4 w-4" />
          Recruit Elf
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Recruit New Elf</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Elf Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jingle Sparklefoot"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skill">Skill</Label>
              <Select value={skill} onValueChange={(v) => setSkill(v as typeof skill)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toymaker">🔧 Toymaker</SelectItem>
                  <SelectItem value="wrapper">🎁 Wrapper</SelectItem>
                  <SelectItem value="logistics">🚀 Logistics</SelectItem>
                  <SelectItem value="quality">✅ Quality</SelectItem>
                  <SelectItem value="tech">💻 Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Energy %</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Efficiency %</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Morale</Label>
              <Select value={morale} onValueChange={(v) => setMorale(v as typeof morale)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">😊 Excellent</SelectItem>
                  <SelectItem value="good">🙂 Good</SelectItem>
                  <SelectItem value="tired">😐 Tired</SelectItem>
                  <SelectItem value="exhausted">😫 Exhausted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={createElf.isPending}>
            {createElf.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recruiting...
              </>
            ) : (
              'Recruit Elf'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
