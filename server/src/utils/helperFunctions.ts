  export function determineProjectType(recommendations: string[]): string {
    if (!recommendations || recommendations.length === 0) return 'General Renovation';
    
    const keywords = recommendations.join(' ').toLowerCase();
    if (keywords.includes('kitchen')) return 'Kitchen Renovation';
    if (keywords.includes('bathroom')) return 'Bathroom Renovation';
    if (keywords.includes('addition')) return 'Home Addition';
    if (keywords.includes('basement')) return 'Basement Finishing';
    if (keywords.includes('roof')) return 'Roofing Project';
    if (keywords.includes('whole') || keywords.includes('complete')) return 'Whole Home Renovation';
    return 'General Renovation';
  }


   export function determineCrmStatus(flipScore: number): 'cold' | 'warm' | 'hot' {
    if (flipScore >= 80) return 'hot';
    if (flipScore >= 60) return 'warm';
    return 'cold';
  }



   export function generateTags(flipAnalysis: any): string[] {
    const tags = [];
    if (flipAnalysis.flipScore >= 80) tags.push('high-potential');
    if (flipAnalysis.flipScore < 50) tags.push('high-risk');
    if (flipAnalysis.roi > 20) tags.push('excellent-roi');
    if (flipAnalysis.timeToComplete <= 3) tags.push('quick-flip');
    if (flipAnalysis.riskLevel === 'low') tags.push('low-risk');
    if (flipAnalysis.renovationCost < 50000) tags.push('light-renovation');
    tags.push('realtor-sourced');
    return tags;
  }