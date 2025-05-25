import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { BenchmarkData } from '../types';

interface BenchmarkResponse {
  benchmarks: BenchmarkData[];
}

export function useBenchmarkData(projectType: string, zipCode: string, squareFootage?: number) {
  return useQuery<BenchmarkResponse>({
    queryKey: ['/api/get-benchmark-costs', projectType, zipCode, squareFootage],
    queryFn: () => apiRequest('POST', '/api/get-benchmark-costs', {
      projectType,
      zipCode,
      squareFootage
    }),
    enabled: Boolean(projectType && zipCode),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}