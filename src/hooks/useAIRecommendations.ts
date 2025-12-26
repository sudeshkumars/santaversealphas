import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AIRecommendation {
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category?: string;
  reason?: string;
  action?: string;
  expectedImpact?: string;
}

type RecommendationType = 'gift-recommendations' | 'delivery-optimization' | 'workforce-analysis';

export function useAIRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (type: RecommendationType, context: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-recommendations', {
        body: { type, context },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        if (data.error.includes('Rate limit')) {
          toast({
            title: 'Rate Limit Exceeded',
            description: 'Please wait a moment before trying again.',
            variant: 'destructive',
          });
        } else if (data.error.includes('credits')) {
          toast({
            title: 'Credits Exhausted',
            description: 'Please add AI credits to your workspace.',
            variant: 'destructive',
          });
        }
        throw new Error(data.error);
      }

      setRecommendations(data.recommendations || []);
      return data.recommendations;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get AI recommendations';
      setError(message);
      toast({
        title: 'AI Error',
        description: message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    recommendations,
    error,
    getRecommendations,
    clearRecommendations: () => setRecommendations([]),
  };
}
