// Cost Estimation Feature Types
export interface EstimationFormData {
  projectType: string;
  area: number;
  materialQuality: string;
  timeline: string;
  zipCode?: string;
  laborWorkers?: number;
  laborHours?: number;
  laborRate?: number;
  permitNeeded?: boolean;
  demolitionRequired?: boolean;
}

export interface CostBreakdown {
  materials: { amount: number; percentage: number };
  labor: { amount: number; percentage: number };
  permits: { amount: number; percentage: number };
  equipment: { amount: number; percentage: number };
  overhead: { amount: number; percentage: number };
  total: number;
}

export interface BenchmarkData {
  source: string;
  range: string;
  url: string;
  comparison: 'above' | 'below' | 'within';
}

export interface WhatIfScenario {
  id: string;
  name: string;
  changes: Partial<EstimationFormData>;
  impact: {
    costDifference: number;
    percentageChange: number;
    timeline?: string;
  };
}