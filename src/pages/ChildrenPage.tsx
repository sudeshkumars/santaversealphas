import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { useChildren, DbChild, useDeleteChild, useUpdateChild } from '@/hooks/useChildren';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddChildDialog } from '@/components/forms/AddChildDialog';
import { EditChildDialog } from '@/components/forms/EditChildDialog';
import { 
  Search, 
  CheckCircle, 
  ThumbsUp,
  ThumbsDown,
  Gauge,
  Trash2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useDemoMode } from '@/contexts/DemoContext';
import { mockChildren } from '@/lib/mockData';

const ChildrenPage = () => {
  useRealtimeSync();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { isDemoMode } = useDemoMode();
  const { data: dbChildren, isLoading } = useChildren();
  const deleteChild = useDeleteChild();
  const updateChild = useUpdateChild();

  // Use mock data in demo mode if no real data exists
  const children = isDemoMode && (!dbChildren || dbChildren.length === 0) 
    ? mockChildren.map(c => ({
        id: c.id,
        user_id: '',
        name: c.name,
        age: c.age,
        country: c.country,
        region: c.region,
        behavior_score: c.behaviorScore,
        status: c.status,
        created_at: '',
        updated_at: '',
      })) as DbChild[]
    : dbChildren || [];

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          child.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || child.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const niceCount = children.filter(c => c.status === 'nice').length;
  const naughtyCount = children.filter(c => c.status === 'naughty').length;

  const handleApprove = (child: DbChild) => {
    updateChild.mutate({ id: child.id, status: 'nice', behavior_score: Math.min(100, child.behavior_score + 10) });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Children & Wishlists
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage child profiles, behavior scores, and wishlist approvals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="badge-nice gap-1 px-3 py-1.5">
              <ThumbsUp className="h-3 w-3" />
              {niceCount} Nice
            </Badge>
            <Badge className="badge-naughty gap-1 px-3 py-1.5">
              <ThumbsDown className="h-3 w-3" />
              {naughtyCount} Naughty
            </Badge>
            <AddChildDialog />
          </div>
        </div>

        {/* Filters */}
        <GlassCard>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={selectedStatus === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedStatus(null)}
              >
                All
              </Button>
              <Button 
                variant={selectedStatus === 'nice' ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedStatus('nice')}
                className={selectedStatus === 'nice' ? 'bg-secondary hover:bg-secondary/90' : ''}
              >
                Nice
              </Button>
              <Button 
                variant={selectedStatus === 'naughty' ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedStatus('naughty')}
                className={selectedStatus === 'naughty' ? 'bg-primary hover:bg-primary/90' : ''}
              >
                Naughty
              </Button>
              <Button 
                variant={selectedStatus === 'pending' ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedStatus('pending')}
                className={selectedStatus === 'pending' ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}
              >
                Pending
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Children Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredChildren.map((child) => (
            <ChildCard 
              key={child.id} 
              child={child} 
              onApprove={() => handleApprove(child)}
              onDelete={() => deleteChild.mutate(child.id)}
              isDeleting={deleteChild.isPending}
            />
          ))}
        </div>

        {filteredChildren.length === 0 && !isLoading && (
          <GlassCard className="py-12 text-center">
            <p className="text-muted-foreground">No children found. Add one to get started!</p>
          </GlassCard>
        )}
      </div>
    </MainLayout>
  );
};

interface ChildCardProps {
  child: DbChild;
  onApprove: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function ChildCard({ child, onApprove, onDelete, isDeleting }: ChildCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-secondary';
    if (score >= 50) return 'text-accent';
    return 'text-primary';
  };

  return (
    <GlassCard className="group transition-all hover:scale-[1.02]" glowColor={child.status === 'nice' ? 'green' : child.status === 'naughty' ? 'red' : 'gold'}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
            {child.status === 'nice' ? '😊' : child.status === 'naughty' ? '😈' : '🤔'}
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">{child.name}</h3>
            <p className="text-sm text-muted-foreground">
              Age {child.age} • {child.country}
            </p>
          </div>
        </div>
        <Badge className={cn(
          'capitalize',
          child.status === 'nice' && 'badge-nice',
          child.status === 'naughty' && 'badge-naughty',
          child.status === 'pending' && 'badge-gold'
        )}>
          {child.status}
        </Badge>
      </div>

      {/* Behavior Score */}
      <div className="mt-4 flex items-center gap-3">
        <Gauge className={cn('h-4 w-4', getScoreColor(child.behavior_score))} />
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Behavior Score</span>
            <span className={cn('font-bold', getScoreColor(child.behavior_score))}>
              {child.behavior_score}/100
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-500',
                child.behavior_score >= 80 ? 'bg-secondary' : 
                child.behavior_score >= 50 ? 'bg-accent' : 'bg-primary'
              )}
              style={{ width: `${child.behavior_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Region */}
      <div className="mt-3 text-sm text-muted-foreground">
        Region: {child.region}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <EditChildDialog child={child} />
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-3 w-3" />
          Remove
        </Button>
        <Button 
          size="sm" 
          className="flex-1 bg-secondary hover:bg-secondary/90"
          onClick={onApprove}
        >
          <CheckCircle className="mr-2 h-3 w-3" />
          Approve
        </Button>
      </div>
    </GlassCard>
  );
}

export default ChildrenPage;
