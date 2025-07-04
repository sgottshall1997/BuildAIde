// Maryland Regional Cost Multipliers (Base: Montgomery County = 1.0)
export const REGIONAL_MULTIPLIERS: { [key: string]: number } = {
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
export const BASE_COSTS_PER_SQFT = {
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
export const TIMELINE_MULTIPLIERS = {
    '1-2 weeks': 1.25,     // Rush premium
    '2-4 weeks': 1.15,     // Fast track
    '4-8 weeks': 1.0,      // Standard
    '8-12 weeks': 0.95,    // Extended timeline discount
    '3-6 months': 0.90,    // Long timeline discount
    '6+ months': 0.85      // Maximum discount
};

// Material Quality Adjustments
export const QUALITY_ADJUSTMENTS = {
    budget: 0.8,
    standard: 1.0,
    premium: 1.4,
    luxury: 2.0
};
