// AI Assistant Feature Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIAnalysisRequest {
  type: 'estimate' | 'risk' | 'market' | 'project';
  data: any;
  context?: string;
}

export interface AIResponse {
  content: string;
  confidence: number;
  sources?: string[];
  recommendations?: string[];
}

export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  riskExplanation: string;
  factors: {
    category: string;
    risk: 'low' | 'medium' | 'high';
    description: string;
  }[];
}

export interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'cost-saving' | 'quality' | 'timeline' | 'efficiency';
  estimatedSavings?: number;
}