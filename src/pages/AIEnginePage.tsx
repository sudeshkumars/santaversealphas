import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Zap,
  Loader2,
  Gift,
  Truck,
  Users
} from 'lucide-react';
import { useAIRecommendations, AIRecommendation } from '@/hooks/useAIRecommendations';
import { useChildren } from '@/hooks/useChildren';
import { useDeliveries } from '@/hooks/useDeliveries';
import { useElves } from '@/hooks/useElves';

const AIEnginePage = () => {
  const { getRecommendations, isLoading, recommendations } = useAIRecommendations();
  const { data: children } = useChildren();
  const { data: deliveries } = useDeliveries();
  const { data: elves } = useElves();
  const [activeTab, setActiveTab] = useState<'gifts' | 'logistics' | 'workforce'>('gifts');
  const [hasGenerated, setHasGenerated] = useState(false);

  const predictions = [
    { region: 'North America', successRate: 97, risk: 'low' },
    { region: 'Europe', successRate: 94, risk: 'low' },
    { region: 'Asia', successRate: 91, risk: 'medium' },
    { region: 'Oceania', successRate: 78, risk: 'high' },
    { region: 'Africa', successRate: 85, risk: 'medium' },
    { region: 'South America', successRate: 89, risk: 'low' },
  ];

  const handleGenerateRecommendations = async () => {
    setHasGenerated(true);
    if (activeTab === 'gifts') {
      await getRecommendations('gift-recommendations', {
        children: children?.slice(0, 10) || [],
        categories: ['Toys', 'Electronics', 'Books', 'Games', 'Art Supplies', 'Sports'],
      });
    } else if (activeTab === 'logistics') {
      await getRecommendations('delivery-optimization', {
        deliveries: deliveries?.slice(0, 10) || [],
      });
    } else {
      await getRecommendations('workforce-analysis', {
        elves: elves?.slice(0, 10) || [],
      });
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'badge-naughty';
      case 'high':
        return 'bg-primary/20 text-primary';
      case 'medium':
        return 'badge-gold';
      default:
        return 'badge-nice';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              AI Decision Engine
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              AI-powered predictions and recommendations for Santa's operations
            </p>
          </div>
          <Badge className="badge-nice gap-2 px-4 py-2">
            <Sparkles className="h-4 w-4" />
            AI Enhanced
          </Badge>
        </div>

        {/* Christmas Success Forecast */}
        <GlassCard glowColor="green">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
                <Brain className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Christmas Success Forecast</h3>
                <p className="text-xs text-muted-foreground">AI-predicted delivery success rate</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl font-bold text-secondary">94.2%</p>
              <p className="text-xs text-muted-foreground">Confidence Level</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <Target className="mx-auto h-8 w-8 text-primary mb-2" />
              <p className="text-2xl font-bold">2.8B</p>
              <p className="text-xs text-muted-foreground">Gifts Targeted</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-secondary mb-2" />
              <p className="text-2xl font-bold">+5.2%</p>
              <p className="text-xs text-muted-foreground">vs Last Year</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <Zap className="mx-auto h-8 w-8 text-accent mb-2" />
              <p className="text-2xl font-bold">12ms</p>
              <p className="text-xs text-muted-foreground">Decision Time</p>
            </div>
          </div>
        </GlassCard>

        {/* Regional Predictions & AI Recommendations */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Regional Success Predictions
            </h3>
            <div className="space-y-4">
              {predictions.map((pred) => (
                <div key={pred.region} className="flex items-center gap-4">
                  <span className="w-32 text-sm font-medium">{pred.region}</span>
                  <div className="flex-1">
                    <Progress value={pred.successRate} />
                  </div>
                  <span className="w-12 text-right text-sm font-bold">{pred.successRate}%</span>
                  <Badge className={
                    pred.risk === 'low' ? 'badge-nice' :
                    pred.risk === 'medium' ? 'badge-gold' : 'badge-naughty'
                  }>
                    {pred.risk}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Recommendations */}
          <GlassCard glowColor="gold">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                AI Recommendations
              </h3>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={activeTab === 'gifts' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('gifts')}
                  className="h-7 px-2"
                >
                  <Gift className="h-3 w-3 mr-1" />
                  Gifts
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === 'logistics' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('logistics')}
                  className="h-7 px-2"
                >
                  <Truck className="h-3 w-3 mr-1" />
                  Logistics
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === 'workforce' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('workforce')}
                  className="h-7 px-2"
                >
                  <Users className="h-3 w-3 mr-1" />
                  Elves
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleGenerateRecommendations}
              disabled={isLoading}
              className="w-full mb-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Generate {activeTab === 'gifts' ? 'Gift' : activeTab === 'logistics' ? 'Delivery' : 'Workforce'} Recommendations
                </>
              )}
            </Button>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {!hasGenerated && !isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Click the button above to generate AI recommendations</p>
                </div>
              )}
              
              {recommendations.map((rec: AIRecommendation, index: number) => (
                <div 
                  key={index}
                  className="rounded-lg border border-border/50 bg-muted/30 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-4 w-4 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{rec.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                        {rec.reason && (
                          <p className="text-xs text-muted-foreground/70 mt-1 italic">{rec.reason}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getPriorityBadgeClass(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Dismiss
                    </Button>
                    <Button size="sm" className="flex-1 bg-secondary hover:bg-secondary/90">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Naughty/Nice Prediction */}
        <GlassCard>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Behavior Score Prediction Model
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI analyzes multiple behavioral factors to predict Naughty/Nice classification 
                with high accuracy. Factors include:
              </p>
              <ul className="space-y-2">
                {['Sharing behavior', 'Homework completion', 'Kindness to others', 'Listening to parents', 'Room cleanliness'].map((factor) => (
                  <li key={factor} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 border border-border">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gradient-christmas">98.7%</p>
                    <p className="text-xs text-muted-foreground">Prediction Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default AIEnginePage;
