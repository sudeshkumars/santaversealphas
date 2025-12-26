import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { useElves, useTasks, DbElf, DbTask, useUpdateTask, useDeleteTask, useDeleteElf } from '@/hooks/useElves';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddElfDialog } from '@/components/forms/AddElfDialog';
import { AddTaskDialog } from '@/components/forms/AddTaskDialog';
import { EditElfDialog } from '@/components/forms/EditElfDialog';
import { 
  Battery,
  Zap,
  CheckCircle,
  Clock,
  ListTodo,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  Loader2,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoMode } from '@/contexts/DemoContext';
import { mockElves, mockTasks } from '@/lib/mockData';

const ElvesPage = () => {
  useRealtimeSync();
  const { isDemoMode } = useDemoMode();
  const { data: dbElves, isLoading: elvesLoading } = useElves();
  const { data: dbTasks, isLoading: tasksLoading } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const deleteElf = useDeleteElf();

  // Use mock data in demo mode if no real data exists
  const elves = isDemoMode && (!dbElves || dbElves.length === 0)
    ? mockElves.map(e => ({
        id: e.id,
        user_id: '',
        name: e.name,
        skill: e.skill,
        energy_level: e.energyLevel,
        tasks_completed: e.tasksCompleted,
        current_task: e.currentTask || null,
        morale: e.morale,
        efficiency: e.efficiency,
        created_at: '',
        updated_at: '',
      })) as DbElf[]
    : dbElves || [];

  const tasks = isDemoMode && (!dbTasks || dbTasks.length === 0)
    ? mockTasks.map(t => ({
        id: t.id,
        user_id: '',
        elf_id: t.assignedTo,
        title: t.title,
        category: t.category,
        priority: t.priority,
        status: t.status,
        deadline: t.deadline,
        created_at: '',
        updated_at: '',
        elves: { name: t.assignedTo }
      })) as (DbTask & { elves: { name: string } | null })[]
    : dbTasks || [];

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const getMoraleIcon = (morale: DbElf['morale']) => {
    switch (morale) {
      case 'excellent': return <Smile className="h-4 w-4 text-secondary" />;
      case 'good': return <Smile className="h-4 w-4 text-accent" />;
      case 'tired': return <Meh className="h-4 w-4 text-accent" />;
      case 'exhausted': return <Frown className="h-4 w-4 text-primary" />;
    }
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 70) return 'bg-secondary';
    if (energy >= 40) return 'bg-accent';
    return 'bg-primary';
  };

  const getSkillEmoji = (skill: DbElf['skill']) => {
    switch (skill) {
      case 'toymaker': return '🔧';
      case 'wrapper': return '🎁';
      case 'quality': return '✅';
      case 'logistics': return '🚀';
      case 'tech': return '💻';
    }
  };

  const moveTask = (task: DbTask & { elves: { name: string } | null }, newStatus: 'todo' | 'in_progress' | 'completed') => {
    updateTask.mutate({ id: task.id, status: newStatus });
  };

  const isLoading = elvesLoading || tasksLoading;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Elf Workforce Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor elf performance, energy levels, and task assignments
            </p>
          </div>
          <div className="flex gap-2">
            <AddTaskDialog />
            <AddElfDialog />
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Elf Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {elves.map((elf) => (
            <GlassCard 
              key={elf.id} 
              className="group"
              glowColor={elf.morale === 'excellent' || elf.morale === 'good' ? 'green' : elf.morale === 'exhausted' ? 'red' : 'gold'}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
                    {getSkillEmoji(elf.skill)}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">{elf.name}</h3>
                    <p className="text-xs capitalize text-muted-foreground">{elf.skill}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getMoraleIcon(elf.morale)}
                  <EditElfDialog elf={elf} />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteElf.mutate(elf.id)}
                    disabled={deleteElf.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {/* Energy Level */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Battery className="h-3 w-3" /> Energy
                  </span>
                  <span className={cn(
                    'font-bold',
                    elf.energy_level >= 70 ? 'text-secondary' : 
                    elf.energy_level >= 40 ? 'text-accent' : 'text-primary'
                  )}>
                    {elf.energy_level}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className={cn('h-full rounded-full transition-all', getEnergyColor(elf.energy_level))}
                    style={{ width: `${elf.energy_level}%` }}
                  />
                </div>
              </div>

              {/* Efficiency */}
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" /> Efficiency
                </span>
                <span className="text-sm font-bold text-foreground">{elf.efficiency}%</span>
              </div>

              {/* Tasks Completed */}
              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3" /> Tasks Done
                </span>
                <span className="text-sm font-bold text-foreground">{elf.tasks_completed.toLocaleString()}</span>
              </div>

              {/* Current Task */}
              {elf.current_task && (
                <div className="mt-3 rounded-lg bg-muted/50 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Current Task</p>
                  <p className="text-sm font-medium">{elf.current_task}</p>
                </div>
              )}

              {elf.energy_level < 30 && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/10 p-2 text-primary">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">Needs rest!</span>
                </div>
              )}
            </GlassCard>
          ))}
        </div>

        {elves.length === 0 && !isLoading && (
          <GlassCard className="py-12 text-center">
            <p className="text-muted-foreground">No elves recruited yet. Add some to your workforce!</p>
          </GlassCard>
        )}

        {/* Kanban Board */}
        <div>
          <h2 className="mb-4 font-display text-xl font-bold">Task Board</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {/* To Do */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">To Do</h3>
                <Badge variant="outline">{todoTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {todoTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onMove={(status) => moveTask(task, status)}
                    onDelete={() => deleteTask.mutate(task.id)}
                  />
                ))}
              </div>
            </div>

            {/* In Progress */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <h3 className="font-medium">In Progress</h3>
                <Badge className="bg-accent/20 text-accent">{inProgressTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task}
                    onMove={(status) => moveTask(task, status)}
                    onDelete={() => deleteTask.mutate(task.id)}
                  />
                ))}
              </div>
            </div>

            {/* Completed */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <h3 className="font-medium">Completed</h3>
                <Badge className="bg-secondary/20 text-secondary">{completedTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task}
                    onMove={(status) => moveTask(task, status)}
                    onDelete={() => deleteTask.mutate(task.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

interface TaskCardProps {
  task: DbTask & { elves: { name: string } | null };
  onMove: (status: 'todo' | 'in_progress' | 'completed') => void;
  onDelete: () => void;
}

function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  const getPriorityColor = (priority: DbTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'badge-naughty';
      case 'high': return 'bg-primary/20 text-primary border-primary/30';
      case 'medium': return 'badge-gold';
      case 'low': return 'badge-nice';
    }
  };

  const getNextStatus = (current: DbTask['status']): 'todo' | 'in_progress' | 'completed' | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'completed';
    return null;
  };

  const nextStatus = getNextStatus(task.status);

  return (
    <GlassCard className="p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium">{task.title}</h4>
        <Badge className={cn('text-[10px] capitalize', getPriorityColor(task.priority))}>
          {task.priority}
        </Badge>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {task.elves?.name || 'Unassigned'}
      </p>
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{task.category}</span>
        {task.deadline && <span>Due: {task.deadline}</span>}
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={onDelete}>
          <Trash2 className="h-3 w-3" />
        </Button>
        {nextStatus && (
          <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={() => onMove(nextStatus)}>
            Move <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
    </GlassCard>
  );
}

export default ElvesPage;
