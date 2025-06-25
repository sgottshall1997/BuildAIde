// Enhanced Cost Engine - Scalable Maryland Construction Pricing (2024 Q4)
// Professional cost calculation with regional multipliers and material indices

interface CostParameters {
  projectType: string;
  area: number;
  materialQuality: string;
  timeline: string;
  zipCode?: string;
  laborWorkers?: number;
  laborHours?: number;
  laborRate?: number;
}

interface CostBreakdown {
  materials: { amount: number; percentage: number };
  labor: { amount: number; percentage: number };
  permits: { amount: number; percentage: number };
  equipment: { amount: number; percentage: number };
  overhead: { amount: number; percentage: number };
  total: number;
}

// Maryland Regional Cost Multipliers (Base: Montgomery County = 1.0)
const REGIONAL_MULTIPLIERS: { [key: string]: number } = {
  // Montgomery County (Bethesda, Rockville, Gaithersburg)
  '20814': 1.15, '20815': 1.20, '20816': 1.18, '20817': 1.22, '20852': 1.10, '20853': 1.12,
  '20854': 1.08, '20855': 1.14, '20878': 1.16, '20879': 1.11, '20886': 1.09, '20895': 1.13,
  
  // Prince George's County (Hyattsville, College Park, Bowie)
  '20737': 0.95, '20740': 0.92, '20742': 0.90, '20782': 0.94, '20783': 0.93, '20784': 0.91,
  '20785': 0.96, '20787': 0.97, '20794': 0.89, '20912': 0.88,
  
  // Anne Arundel County (Annapolis, Glen Burnie)
  '21401': 1.05, '21403': 1.07, '21409': 1.03, '21122': 1.02, '21144': 1.01, '21146': 1.04,
  
  // Howard County (Columbia, Ellicott City)
  '21042': 1.12, '21043': 1.14, '21044': 1.11, '21045': 1.13, '21075': 1.10,
  
  // Default Maryland
  'default': 1.0
};

// Base Cost Per Square Foot (Montgomery County baseline)
const BASE_COSTS_PER_SQFT = {
  'kitchen-remodel': {
    budget: 160, standard: 195, premium: 280, luxury: 420
  },
  'bathroom-remodel': {
    budget: 220, standard: 285, premium: 410, luxury: 650
  },
  'home-addition': {
    budget: 180, standard: 240, premium: 340, luxury: 480
  },
  'deck-construction': {
    budget: 35, standard: 55, premium: 85, luxury: 120
  },
  'flooring-installation': {
    budget: 8, standard: 15, premium: 25, luxury: 45
  },
  'roofing-replacement': {
    budget: 8, standard: 12, premium: 18, luxury: 28
  },
  'siding-installation': {
    budget: 6, standard: 11, premium: 16, luxury: 24
  }
};

// Timeline Multipliers (Rush jobs cost more)
const TIMELINE_MULTIPLIERS = {
  '1-2 weeks': 1.25,     // Rush premium
  '2-4 weeks': 1.15,     // Fast track
  '4-8 weeks': 1.0,      // Standard
  '8-12 weeks': 0.95,    // Extended timeline discount
  '3-6 months': 0.90,    // Long timeline discount
  '6+ months': 0.85      // Maximum discount
};

// Material Quality Adjustments
const QUALITY_ADJUSTMENTS = {
  budget: 0.8,
  standard: 1.0,
  premium: 1.4,
  luxury: 2.0
};

export function calculateEnhancedEstimate(params: CostParameters): CostBreakdown {
  const {
    projectType,
    area,
    materialQuality,
    timeline,
    zipCode,
    laborWorkers = 2,
    laborHours = 24,
    laborRate = 55
  } = params;

  // Parse timeline to extract actual hours constraint
  const parseTimelineHours = (timelineStr: string): number | null => {
    if (!timelineStr) return null;
    
    const lowerTimeline = timelineStr.toLowerCase();
    const numberMatch = lowerTimeline.match(/(\d+(?:\.\d+)?)/);
    const number = numberMatch ? parseFloat(numberMatch[1]) : null;
    
    if (number && lowerTimeline.includes('hour')) {
      return number;
    }
    return null;
  };

  const timelineHours = parseTimelineHours(timeline);

  // Validate input parameters
  if (!projectType || !area || area <= 0) {
    throw new Error('Invalid project parameters: projectType and area are required');
  }

  if (isNaN(Number(area))) {
    throw new Error('Area must be a valid number');
  }

  // Get base cost per square foot
  const baseCosts = BASE_COSTS_PER_SQFT[projectType as keyof typeof BASE_COSTS_PER_SQFT];
  if (!baseCosts) {
    throw new Error(`Unsupported project type: ${projectType}`);
  }

  const baseCostPerSqft = baseCosts[materialQuality as keyof typeof baseCosts] || baseCosts.standard;
  
  // Ensure we have a valid base cost
  if (!baseCostPerSqft || isNaN(baseCostPerSqft)) {
    throw new Error(`Invalid base cost for ${projectType} with ${materialQuality} quality`);
  }

  // Apply regional multiplier
  const regionalMultiplier = REGIONAL_MULTIPLIERS[zipCode || 'default'] || REGIONAL_MULTIPLIERS.default;

  // Apply timeline multiplier
  const timelineMultiplier = TIMELINE_MULTIPLIERS[timeline] || 1.0;

  // Apply quality adjustment
  const qualityMultiplier = QUALITY_ADJUSTMENTS[materialQuality as keyof typeof QUALITY_ADJUSTMENTS] || 1.0;

  // Validate multipliers
  if (isNaN(regionalMultiplier) || isNaN(timelineMultiplier) || isNaN(qualityMultiplier)) {
    throw new Error('Invalid calculation multipliers');
  }

  // Calculate base project cost
  const adjustedCostPerSqft = baseCostPerSqft * regionalMultiplier * timelineMultiplier * qualityMultiplier;
  const baseProjectCost = Math.round(Number(area) * adjustedCostPerSqft);

  // Validate base project cost
  if (isNaN(baseProjectCost) || baseProjectCost <= 0) {
    throw new Error('Invalid base project cost calculation');
  }

  // Calculate component costs based on industry standards
  const materialsCost = Math.round(baseProjectCost * 0.40);
  
  // If timeline specifies hours, calculate labor cost based on that constraint
  let laborCost;
  if (timelineHours !== null) {
    // Use the specific timeline hours constraint for labor calculation
    laborCost = Math.round(timelineHours * laborWorkers * laborRate);
    console.log(`Timeline constraint: ${timelineHours} hours, calculated labor: $${laborCost}`);
  } else {
    // Use standard percentage calculation
    laborCost = Math.round(baseProjectCost * 0.38);
  }
  
  const permitsCost = Math.round(baseProjectCost * 0.04);
  const equipmentCost = Math.round(baseProjectCost * 0.06);
  const overheadCost = Math.round(baseProjectCost * 0.12);

  const totalCost = materialsCost + laborCost + permitsCost + equipmentCost + overheadCost;

  // Final validation
  if (isNaN(totalCost) || isNaN(materialsCost) || isNaN(laborCost) || isNaN(permitsCost) || isNaN(equipmentCost) || isNaN(overheadCost)) {
    throw new Error('Invalid cost calculation results');
  }

  return {
    materials: {
      amount: materialsCost,
      percentage: Math.round((materialsCost / totalCost) * 100)
    },
    labor: {
      amount: laborCost,
      percentage: Math.round((laborCost / totalCost) * 100)
    },
    permits: {
      amount: permitsCost,
      percentage: Math.round((permitsCost / totalCost) * 100)
    },
    equipment: {
      amount: equipmentCost,
      percentage: Math.round((equipmentCost / totalCost) * 100)
    },
    overhead: {
      amount: overheadCost,
      percentage: Math.round((overheadCost / totalCost) * 100)
    },
    total: totalCost
  };
}

// Generate "What-If" scenarios for different parameters
export function generateWhatIfScenarios(baseParams: CostParameters) {
  const scenarios = {
    budget_option: calculateEnhancedEstimate({
      ...baseParams,
      materialQuality: 'budget'
    }),
    premium_option: calculateEnhancedEstimate({
      ...baseParams,
      materialQuality: 'premium'
    }),
    rush_timeline: calculateEnhancedEstimate({
      ...baseParams,
      timeline: '2-4 weeks'
    }),
    extended_timeline: calculateEnhancedEstimate({
      ...baseParams,
      timeline: '3-6 months'
    })
  };

  return scenarios;
}

// Regional pricing intelligence
export function getRegionalInsights(zipCode?: string): string {
  const multiplier = REGIONAL_MULTIPLIERS[zipCode || 'default'] || 1.0;
  
  if (multiplier >= 1.15) {
    return "Premium market area - Higher material and labor costs due to affluent location and strict building standards.";
  } else if (multiplier >= 1.05) {
    return "Above-average market - Moderate premium for quality materials and skilled contractors.";
  } else if (multiplier <= 0.92) {
    return "Value market area - Lower baseline costs with good contractor availability.";
  } else {
    return "Standard market rates - Typical Maryland pricing for materials and labor.";
  }
}