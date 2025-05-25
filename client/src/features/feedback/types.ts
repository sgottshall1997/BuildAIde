// Feedback Feature Types
export interface FeedbackSubmission {
  id: string;
  rating: number;
  comment?: string;
  usage: string;
  timestamp: string;
  userAgent: string;
  url: string;
  resolved?: boolean;
}

export interface EmailSignup {
  email: string;
  timestamp: string;
  source: string;
  verified?: boolean;
}