import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { EstimationFormData, CostBreakdown } from '../types';

interface EstimationResult {
  estimatedCost: number;
  costBreakdown: CostBreakdown;
  projectDetails: EstimationFormData;
}

export function useEstimationCalculator() {
  const [currentEstimate, setCurrentEstimate] = useState<EstimationResult | null>(null);
  const { toast } = useToast();

  const calculateEstimateMutation = useMutation({
    mutationFn: async (formData: EstimationFormData): Promise<EstimationResult> => {
      return apiRequest('POST', '/api/estimates', formData);
    },
    onSuccess: (data) => {
      setCurrentEstimate(data);
      toast({
        title: "Estimate Generated!",
        description: `Total estimated cost: $${data.estimatedCost.toLocaleString()}`,
      });
    },
    onError: (error) => {
      console.error('Estimation error:', error);
      toast({
        title: "Estimation Failed",
        description: "Unable to generate estimate. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateEstimate = useCallback((formData: EstimationFormData) => {
    calculateEstimateMutation.mutate(formData);
  }, [calculateEstimateMutation]);

  const clearEstimate = useCallback(() => {
    setCurrentEstimate(null);
  }, []);

  return {
    currentEstimate,
    calculateEstimate,
    clearEstimate,
    isCalculating: calculateEstimateMutation.isPending,
    error: calculateEstimateMutation.error,
  };
}