// Features - Consolidated Public API
// This file provides clean imports for all feature modules

// Cost Estimation
export * from './cost-estimation';

// Project Management
export * from './project-management';

// Material Intelligence
export * from './material-intelligence';

// Property Analysis
export * from './property-analysis';

// AI Assistant
export * from './ai-assistant';

// Shared Components & State
export * from './shared';

// User Experience
export * from './onboarding';
export * from './feedback';

// Re-export commonly used UI components for convenience
export { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export { Input, Textarea, Select } from '@/components/ui/input';
export { Badge } from '@/components/ui/badge';