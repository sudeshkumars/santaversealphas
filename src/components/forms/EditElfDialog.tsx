import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Loader2 } from 'lucide-react';
import { useUpdateElf, DbElf } from '@/hooks/useElves';

interface EditElfDialogProps {
  elf: DbElf;
}

export function EditElfDialog({ elf }: EditElfDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(elf.name);
  const [skill, setSkill] = useState<string>(elf.skill);
  const [energyLevel, setEnergyLevel] = useState(elf.energy_level.toString());
  const [tasksCompleted, setTasksCompleted] = useState(elf.tasks_completed.toString());
  const [currentTask, setCurrentTask] = useState(elf.current_task || '');
  const [morale, setMorale] = useState<string>(elf.morale);
  const [efficiency, setEfficiency] = useState(elf.efficiency.toString());

  const updateElf = useUpdateElf();

  useEffect(() => {
    if (open) {
      setName(elf.name);
      setSkill(elf.skill);
      setEnergyLevel(elf.energy_level.toString());
      setTasksCompleted(elf.tasks_completed.toString());
      setCurrentTask(elf.current_task || '');
      setMorale(elf.morale);
      setEfficiency(elf.efficiency.toString());
    }
  }, [open, elf]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateElf.mutateAsync({
      id: elf.id,
      name,
      skill: skill as DbElf['skill'],
      energy_level: parseInt(energyLevel),
      tasks_completed: parseInt(tasksCompleted),
      current_task: currentTask || null,
      morale: morale as DbElf['morale'],
      efficiency: parseInt(efficiency),
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
          <DialogTitle className="font-display">Edit Elf</DialogTitle>
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
              <Label>Skill</Label>
              <Select value={skill} onValueChange={setSkill}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toymaker">🔧 Toymaker</SelectItem>
                  <SelectItem value="wrapper">🎁 Wrapper</SelectItem>
                  <SelectItem value="quality">✅ Quality Control</SelectItem>
                  <SelectItem value="logistics">🚀 Logistics</SelectItem>
                  <SelectItem value="tech">💻 Tech Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Energy Level (%)</Label>
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
              <Label>Efficiency (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Morale</Label>
              <Select value={morale} onValueChange={setMorale}>
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
            <div className="space-y-2">
              <Label>Tasks Completed</Label>
              <Input
                type="number"
                min="0"
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Task (optional)</Label>
            <Input
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="Enter current task..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={updateElf.isPending}>
            {updateElf.isPending ? (
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
