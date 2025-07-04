import { BASE_COSTS_PER_SQFT, QUALITY_ADJUSTMENTS, REGIONAL_MULTIPLIERS, TIMELINE_MULTIPLIERS } from "@server/constants/region.constant";
import { CostBreakdown, CostParameters } from "@server/interfaces/estimate/estimate.interface";

export function calculateEnhancedEstimate(params: CostParameters): CostBreakdown {
    const {
        projectType,
        area,
        materialQuality,
        timeline,
        zipCode,
        laborWorkers = 2,
        laborHours = 24,
        laborRate = 55,
        equipmentCost = 0,
        overheadCost = 0
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
    const timelineMultiplier = TIMELINE_MULTIPLIERS[timeline as keyof typeof TIMELINE_MULTIPLIERS] || 1.0;

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

    // Calculate component costs - prioritize user inputs over estimates
    const materialsCost = Math.round(baseProjectCost * 0.40);
    const permitsCost = Math.round(baseProjectCost * 0.04);

    // Calculate labor cost precisely based on user inputs
    let laborCost;
    if (timelineHours !== null) {
        // Use the specific timeline hours constraint for labor calculation
        laborCost = Math.round(timelineHours * laborWorkers * laborRate);
        console.log(`Timeline constraint: ${timelineHours} hours × ${laborWorkers} workers × $${laborRate}/hr = $${laborCost}`);
    } else if (laborHours && laborWorkers && laborRate) {
        // Use specific labor inputs for precise calculation
        laborCost = Math.round(laborHours * laborWorkers * laborRate);
        console.log(`Labor calculation: ${laborHours} hours × ${laborWorkers} workers × $${laborRate}/hr = $${laborCost}`);
    } else {
        // Fall back to percentage calculation only if no specific inputs provided
        laborCost = Math.round(baseProjectCost * 0.38);
    }

    // Use user-specified equipment and overhead costs, or calculate estimates if not provided
    const finalEquipmentCost = equipmentCost > 0 ? equipmentCost : Math.round(baseProjectCost * 0.06);
    const finalOverheadCost = overheadCost > 0 ? overheadCost : Math.round(baseProjectCost * 0.12);

    const totalCost = materialsCost + laborCost + permitsCost + finalEquipmentCost + finalOverheadCost;

    // Final validation
    if (isNaN(totalCost) || isNaN(materialsCost) || isNaN(laborCost) || isNaN(permitsCost) || isNaN(finalEquipmentCost) || isNaN(finalOverheadCost)) {
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
            amount: finalEquipmentCost,
            percentage: Math.round((finalEquipmentCost / totalCost) * 100)
        },
        overhead: {
            amount: finalOverheadCost,
            percentage: Math.round((finalOverheadCost / totalCost) * 100)
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