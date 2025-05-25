interface UsageData {
  toolCounts: Record<string, number>;
  totalUses: number;
  emailProvided: boolean;
  userEmail?: string;
  signupDate?: string;
  lastUsage?: string;
}

const USAGE_LIMIT = 3;

export class UsageTracker {
  private storageKey = 'constructiontools-usage';

  private getUsageData(): UsageData {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading usage data:', error);
    }

    return {
      toolCounts: {},
      totalUses: 0,
      emailProvided: false,
      lastUsage: new Date().toISOString()
    };
  }

  private saveUsageData(data: UsageData): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving usage data:', error);
    }
  }

  public trackToolUsage(toolName: string): { shouldShowSignup: boolean; usageCount: number; remainingUses: number } {
    const data = this.getUsageData();
    
    // Don't track if user already provided email
    if (data.emailProvided) {
      return {
        shouldShowSignup: false,
        usageCount: data.toolCounts[toolName] || 0,
        remainingUses: Infinity
      };
    }

    // Increment usage
    data.toolCounts[toolName] = (data.toolCounts[toolName] || 0) + 1;
    data.totalUses = Object.values(data.toolCounts).reduce((sum, count) => sum + count, 0);
    data.lastUsage = new Date().toISOString();

    this.saveUsageData(data);

    const shouldShowSignup = data.totalUses >= USAGE_LIMIT;
    const remainingUses = Math.max(0, USAGE_LIMIT - data.totalUses);

    return {
      shouldShowSignup,
      usageCount: data.toolCounts[toolName],
      remainingUses
    };
  }

  public saveUserEmail(email: string): void {
    const data = this.getUsageData();
    data.emailProvided = true;
    data.userEmail = email;
    data.signupDate = new Date().toISOString();
    this.saveUsageData(data);
  }

  public hasProvidedEmail(): boolean {
    const data = this.getUsageData();
    return data.emailProvided;
  }

  public getTotalUsage(): number {
    const data = this.getUsageData();
    return data.totalUses;
  }

  public getToolUsage(toolName: string): number {
    const data = this.getUsageData();
    return data.toolCounts[toolName] || 0;
  }

  public getRemainingUses(): number {
    const data = this.getUsageData();
    if (data.emailProvided) return Infinity;
    return Math.max(0, USAGE_LIMIT - data.totalUses);
  }

  public reset(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const usageTracker = new UsageTracker();